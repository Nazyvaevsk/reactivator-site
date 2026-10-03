import { rateLimit, withCapacity } from "@/lib/rateLimit";
import { createBodyIssueUrl } from "@/lib/bodyIssue";
import { getBodyDimensionsGroup } from "@/lib/bodyDimensionsData";
import { NextRequest, NextResponse } from "next/server";

const RELAY_URL =
  "https://reactivator-telegram-relay.nazyvaevsk.workers.dev";

const MAX_SINGLE_PHOTO_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE = 12 * 1024 * 1024;
const MAX_NAME_LENGTH = 80;
const MAX_PHONE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 2000;

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
  return withCapacity("telegram", 8, () => submit(request));
}

async function submit(request: NextRequest) {
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

    const contentLength = Number(request.headers.get("content-length"));
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_REQUEST_SIZE
    ) {
      return NextResponse.json(
        { error: "Запрос слишком большой" },
        { status: 413 }
      );
    }

    const reader = request.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "Неверный запрос" },
        { status: 400 }
      );
    }

    const chunks: Uint8Array[] = [];
    let receivedSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      receivedSize += value.byteLength;

      if (receivedSize > MAX_REQUEST_SIZE) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Запрос слишком большой" },
          { status: 413 }
        );
      }

      chunks.push(value);
    }

    const boundedRequest = new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: Buffer.concat(chunks),
    });

    const formData = await boundedRequest.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    let description = String(formData.get("description") || "").trim();

    if (!name || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: "Укажите имя длиной до 80 символов" },
        { status: 400 }
      );
    }

    if (!phone || phone.length > MAX_PHONE_LENGTH) {
      return NextResponse.json(
        { error: "Укажите корректный номер телефона" },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Укажите корректный номер телефона" },
        { status: 400 }
      );
    }

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

    if (hasPhoto && photo.size > MAX_SINGLE_PHOTO_SIZE) {
      return NextResponse.json(
        { error: "Размер одной фотографии не должен превышать 10 МБ" },
        { status: 400 }
      );
    }

    if (hasPhoto && !photo.type.toLowerCase().startsWith("image/")) {
      return NextResponse.json(
        { error: "Можно отправлять только изображения" },
        { status: 400 }
      );
    }

    if (mode !== "body-dimensions") {
      if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
        return NextResponse.json(
          { error: "Описание обязательно и не должно превышать 2000 символов" },
          { status: 400 }
        );
      }
    }

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

    if (sendMessage) {
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

      const messageResponse = await fetch(RELAY_URL, {
        method: "POST",
        headers: {
          "X-Relay-Secret": relaySecret,
        },
        body: messageForm,
        signal: AbortSignal.timeout(20_000),
      });

      const relayResult = await messageResponse
        .json()
        .catch(() => null);

      if (!messageResponse.ok || relayResult?.ok === false) {
        console.error(
          "Relay sendMessage failed, HTTP status:",
          messageResponse.status
        );

        return NextResponse.json(
          { error: "Не удалось отправить заявку" },
          { status: 500 }
        );
      }
    }

    if (hasPhoto) {
      const photoForm = new FormData();
      photoForm.append("method", "sendPhoto");
      photoForm.append("chat_id", chatId);
      photoForm.append("photo", photo, photo.name);

      const photoResponse = await fetch(RELAY_URL, {
        method: "POST",
        headers: {
          "X-Relay-Secret": relaySecret,
        },
        body: photoForm,
        signal: AbortSignal.timeout(20_000),
      });

      if (!photoResponse.ok) {
        console.error(
          "Relay sendPhoto failed, HTTP status:",
          photoResponse.status
        );

        return NextResponse.json(
          { error: "Не удалось отправить фотографию" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    console.error("send-telegram request failed");

    return NextResponse.json(
      { error: "Ошибка обработки заявки" },
      { status: 500 }
    );
  }
}
