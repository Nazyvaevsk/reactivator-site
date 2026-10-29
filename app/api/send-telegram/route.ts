import { normalizePhone, validName, validDescription } from "@/lib/contactValidation";
import { BodyReadError, readBoundedBody } from "@/lib/boundedBody";
import { acquireSubmission, digest, SubmissionError, validatePhoto } from "@/lib/applicationUploads";
import { randomUUID } from "node:crypto";
import { rateLimit, withCapacity } from "@/lib/rateLimit";
import { createBodyIssueUrl } from "@/lib/bodyIssue";
import { getBodyDimensionsGroup } from "@/lib/bodyDimensionsData";
import { NextRequest, NextResponse } from "next/server";

const RELAY_URL =
  "https://reactivator-telegram-relay.nazyvaevsk.workers.dev";

const MAX_REQUEST_SIZE = 12 * 1024 * 1024;
export const runtime = "nodejs";

// Use public origins, not the internal URL or forwarded headers behind Caddy.
const ALLOWED_ORIGINS = new Set([
  "https://reactivator55.ru",
  "https://www.reactivator55.ru",
]);

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (process.env.NODE_ENV !== "development") return false;

  try {
    const url = new URL(origin);
    return (
      origin === url.origin &&
      (url.protocol === "http:" || url.protocol === "https:") &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  const started = Date.now();
  const context = { stage: "entry", requestId };
  console.info(JSON.stringify({ event: "application_start", requestId }));
  let response: Response;
  try {
    response = await withCapacity("telegram", 8, () => submit(request, context));
  } catch {
    response = NextResponse.json({ error: "Ошибка обработки заявки" }, { status: 500 });
  }
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Request-ID", requestId);
  // Metadata only: never log PII, bodies, credentials, upload tokens or signed URLs.
  console.info(JSON.stringify({ event: "application", requestId, at: new Date().toISOString(),
    stage: context.stage, status: response.status, durationMs: Date.now() - started }));
  return response;
}

async function submit(request: NextRequest, context: { stage: string; requestId: string }) {
  // Reject cross-site submissions before reading the body or contacting Telegram.
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    !isAllowedOrigin(request.headers.get("origin"))
  ) {
    return NextResponse.json(
      { error: "Отправка с этого источника запрещена" },
      { status: 403 }
    );
  }
  const limited = rateLimit(request, "telegram-upload", 30, 10 * 60_000, 300);
  if (limited) return limited;
  try {
    const chatId = process.env.MASTER_CHAT_ID;
    const relaySecret = process.env.RELAY_SECRET;

    if (!chatId || !relaySecret) {
      return NextResponse.json(
        { error: "Сервер отправки заявок не настроен" },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Неверный формат запроса" },
        { status: 415 }
      );
    }

    context.stage = "read-body";
    const bytes = await readBoundedBody(request, MAX_REQUEST_SIZE);
    const boundedRequest = new Request(request.url, {
      method: "POST", headers: { "content-type": contentType }, body: new Uint8Array(bytes),
    });

    context.stage = "parse-multipart";
    let formData: FormData;
    try { formData = await boundedRequest.formData(); }
    catch { throw new SubmissionError(400, "Неверный формат данных заявки."); }

    // Reject duplicate or file-valued scalar fields rather than coercing them.
    for (const key of ["name", "phone", "description", "mode", "groupId", "sendMessage", "website",
      "submissionId", "uploadToken", "photoIndex", "photoCount"]) {
      const values = formData.getAll(key);
      if (values.length > 1 || values.some(value => typeof value !== "string")) {
        throw new SubmissionError(400, "Неверные поля заявки.");
      }
    }
    if (formData.getAll("photo").length > 1) throw new SubmissionError(400, "Отправляйте фото по одному.");
    if (String(formData.get("website") || "").trim()) throw new SubmissionError(400, "Не удалось отправить заявку.");
    const name = String(formData.get("name") || "").trim();
    const phone = normalizePhone(String(formData.get("phone") || "").trim());
    let description = String(formData.get("description") || "").trim();
    if (!validName(name)) throw new SubmissionError(400, "Укажите имя от 2 до 80 символов без цифр и ссылок.");
    if (!phone) throw new SubmissionError(400, "Укажите российский мобильный номер: +7, 8 или 10 цифр с 9.");

    const sendMessageRaw = String(
      formData.get("sendMessage") ?? "true"
    );

    if (sendMessageRaw !== "true" && sendMessageRaw !== "false") {
      return NextResponse.json(
        { error: "Неверный параметр отправки" },
        { status: 400 }
      );
    }

    const sendMessage = sendMessageRaw === "true";
    const mode = String(formData.get("mode") || "repair");

    if (
      mode !== "repair" &&
      mode !== "body-dimensions" &&
      mode !== "body-dimensions-search"
    ) {
      return NextResponse.json(
        { error: "Неизвестный тип заявки" },
        { status: 400 }
      );
    }

    const photo = formData.get("photo");
    const hasPhoto = photo instanceof File && photo.size > 0;

    if (photo !== null && !hasPhoto) throw new SubmissionError(400, "Неверная фотография.");
    if (mode !== "body-dimensions" && !validDescription(description)) {
      throw new SubmissionError(400, "Опишите запрос: от 5 до 2000 символов без управляющих знаков.");
    }
    context.stage = "validate-photo";
    const verifiedPhoto = hasPhoto ? await validatePhoto(photo as File) : null;

    let issueUrl: string | undefined;

    if (mode === "body-dimensions") {
      const groupId = String(
        formData.get("groupId") || ""
      ).trim().toUpperCase();

      const group = getBodyDimensionsGroup(groupId);

      if (!group || !Object.hasOwn(group, "groupId")) {
        return NextResponse.json(
          { error: "Неизвестный комплект" },
          { status: 400 }
        );
      }

      description =
        "Покупка кузовных размеров\n" +
        group.make +
        " " +
        group.model +
        " " +
        group.year +
        " / " +
        (group.variant || "—") +
        "\nКомплект: " +
        group.groupId +
        "\nЛистов: " +
        group.sheetCount +
        "\nЦена: 590 ₽";

      try {
        issueUrl = createBodyIssueUrl(group.groupId);
      } catch {
        return NextResponse.json(
          {
            error:
              "Выдача доступа не настроена. Свяжитесь с мастером.",
          },
          { status: 503 }
        );
      }
    }

    if (mode === "repair" && !hasPhoto) {
      return NextResponse.json(
        { error: "Фотография не передана" },
        { status: 400 }
      );
    }

    if (mode === "body-dimensions" && (!sendMessage || hasPhoto)) {
      return NextResponse.json(
        {
          error:
            "Для покупки укажите имя, телефон и комплект без фотографий",
        },
        { status: 400 }
      );
    }

    if (
      mode === "body-dimensions-search" &&
      (!sendMessage || hasPhoto)
    ) {
      return NextResponse.json(
        {
          error:
            "Для поиска укажите имя, телефон, автомобиль и что нужно найти без фотографий",
        },
        { status: 400 }
      );
    }

    if (!sendMessage && !hasPhoto) {
      return NextResponse.json(
        { error: "Нет данных для отправки" },
        { status: 400 }
      );
    }

    const suppliedId = String(formData.get("submissionId") || "");
    if (suppliedId && !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(suppliedId)) throw new SubmissionError(400, "Неверный идентификатор заявки.");
    if (String(formData.get("uploadToken") || "").length > 64) throw new SubmissionError(400, "Неверный токен загрузки.");
    const photoCountRaw = String(formData.get("photoCount") ?? (mode === "repair" ? "10" : "0"));
    const photoIndexRaw = String(formData.get("photoIndex") ?? "0");
    if (!/^\d{1,2}$/.test(photoCountRaw) || !/^\d{1,2}$/.test(photoIndexRaw)) throw new SubmissionError(400, "Неверный номер фото.");
    const maximum = Number(photoCountRaw), photoIndex = Number(photoIndexRaw);
    if ((mode === "repair" && (maximum < 1 || maximum > 10 || photoIndex >= maximum || (sendMessage && photoIndex !== 0))) ||
        (mode !== "repair" && maximum !== 0)) throw new SubmissionError(400, "Неверное количество фотографий.");
    const fingerprint = digest(JSON.stringify([mode, name.toLowerCase(), phone, description, maximum]));
    // Legacy first requests remain accepted. Subsequent photos must present a server receipt.
    const id = suppliedId || randomUUID();
    context.stage = "session";
    const state = acquireSubmission(id, fingerprint, String(formData.get("uploadToken") || ""), sendMessage, maximum);
    try {
      if (sendMessage && state.text === "new") {
        const limited = rateLimit(request, "telegram-message", 3, 10 * 60_000, 60);
        if (limited) return limited;
        let message =
          mode === "body-dimensions-search"
            ? "🔎 ЗАЯВКА НА ПОИСК КУЗОВНЫХ РАЗМЕРОВ\n\n"
            : "🚗 НОВАЯ ЗАЯВКА С САЙТА\n\n";

        message += `👤 Имя: ${name}\n`;
        message += `📞 Телефон: ${phone}\n`;

        if (description) {
          message += `\n📝 ${
            mode === "body-dimensions-search"
              ? "Автомобиль и что нужно найти"
              : mode === "body-dimensions"
                ? "Заявка на покупку"
                : "Что произошло"
          }:\n${description}`;
        }

        if (issueUrl) {
          message +=
            "\n\nТолько для мастера. После проверки оплаты: " +
            issueUrl +
            "\nСлужебная ссылка действует 7 дней. Клиенту отправляйте только созданную ссылку доступа.";
        }

        const messageForm = new FormData();
        messageForm.append("method", "sendMessage");
        messageForm.append("chat_id", chatId);
        messageForm.append("text", message);

        if (issueUrl) {
          messageForm.append("disable_web_page_preview", "true");
          messageForm.append(
            "reply_markup",
            JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: "Выдать доступ на 24 часа",
                    url: issueUrl,
                  },
                ],
              ],
            })
          );
        }

        // An ambiguous network failure must not automatically send the text again.
        state.text = "uncertain";
        context.stage = "relay-message";
        await sendRelay(messageForm, relaySecret, context);
        state.text = "sent";
      }
      if (state.text !== "sent") throw new SubmissionError(403, "Сначала отправьте заявку.");
      if (verifiedPhoto) {
        if (state.uncertainPhotos.has(photoIndex)) throw new SubmissionError(409, "Доставка фото не подтверждена. Свяжитесь с мастером.");
        const previous = state.photos.get(photoIndex);
        if (previous && previous !== verifiedPhoto.hash) throw new SubmissionError(409, "Нельзя заменить уже отправленную фотографию.");
        if (!previous) {
          if (photoIndex !== state.photos.size || state.photos.size >= maximum || state.bytes + verifiedPhoto.bytes.length > 100 * 1024 * 1024) {
            throw new SubmissionError(400, "Нарушен порядок или лимит фотографий.");
          }
          const photoForm = new FormData();
          photoForm.append("method", "sendPhoto");
          photoForm.append("chat_id", chatId);
          photoForm.append("photo", new Blob([new Uint8Array(verifiedPhoto.bytes)], { type: verifiedPhoto.mime }), verifiedPhoto.filename);
          state.uncertainPhotos.add(photoIndex);
          context.stage = "relay-photo";
          await sendRelay(photoForm, relaySecret, context);
          state.uncertainPhotos.delete(photoIndex);
          state.photos.set(photoIndex, verifiedPhoto.hash);
          state.bytes += verifiedPhoto.bytes.length;
        }
      }
      context.stage = "complete";
      return NextResponse.json(suppliedId || mode === "repair"
        ? { success: true, submissionId: id, uploadToken: state.token }
        : { success: true });
    } finally { state.busy = false; }
  } catch (error) {
    if (error instanceof BodyReadError) return NextResponse.json({ error: "Запрос слишком большой, пустой или передавался слишком долго." }, { status: error.status });
    if (error instanceof SubmissionError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("send-telegram request failed");

    return NextResponse.json(
      { error: "Ошибка обработки заявки" },
      { status: 500 }
    );
  }
}

// Never retry an ambiguous upstream delivery: Telegram has no idempotency key.
async function sendRelay(body: FormData, secret: string, context: { stage: string; requestId: string }) {
  let status: number | undefined;
  let kind = "network";
  try {
    const response = await fetch(RELAY_URL, {
      method: "POST", headers: { "X-Relay-Secret": secret }, body,
      signal: AbortSignal.timeout(20_000),
    });
    status = response.status;
    kind = "response";
    const result = await response.json().catch(() => null);
    if (response.ok && result?.ok === true) return;
  } catch { /* Log metadata only; native fetch errors can contain sensitive details. */ }
  console.error(JSON.stringify({ event: "application_relay_failed", requestId: context.requestId,
    stage: context.stage, status, kind }));
  throw new SubmissionError(502, "Доставка не подтверждена. Свяжитесь с мастером, не создавайте новую заявку.");
}
