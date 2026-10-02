import { createBodyIssueUrl } from "@/lib/bodyIssue";
import { getBodyDimensionsGroup } from "@/lib/bodyDimensionsData";
import { NextRequest, NextResponse } from "next/server";

const RELAY_URL =
  "https://reactivator-telegram-relay.nazyvaevsk.workers.dev";

const MAX_SINGLE_PHOTO_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const chatId = process.env.MASTER_CHAT_ID;
    const relaySecret = process.env.RELAY_SECRET;

    if (!chatId || !relaySecret) {
      return NextResponse.json(
        { error: "Сервер отправки заявок не настроен" },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    let description = String(formData.get("description") || "").trim();

    const sendMessage =
      String(formData.get("sendMessage") || "true") === "true";

    const mode = String(formData.get("mode") || "repair");

    if (mode !== "repair" && mode !== "body-dimensions" && mode !== "body-dimensions-search") {
      return NextResponse.json({ error: "Неизвестный тип заявки" }, { status: 400 });
    }

    let issueUrl: string | undefined;
    if (mode === "body-dimensions") {
      const groupId = String(formData.get("groupId") || "").trim().toUpperCase();
      const group = getBodyDimensionsGroup(groupId);
      if (!group || !Object.hasOwn(group, "groupId")) {
        return NextResponse.json({ error: "Неизвестный комплект" }, { status: 400 });
      }
      // The purchase identity and price must not come from editable client text.
      description = "Покупка кузовных размеров\n" + group.make + " " + group.model + " " + group.year + " / " + (group.variant || "—") + "\nКомплект: " + group.groupId + "\nЛистов: " + group.sheetCount + "\nЦена: 590 ₽";
      try { issueUrl = createBodyIssueUrl(group.groupId); }
      catch { return NextResponse.json({ error: "Выдача доступа не настроена. Свяжитесь с мастером." }, { status: 503 }); }
    }

    const photo = formData.get("photo");

    const hasPhoto =
      photo instanceof File && photo.size > 0;

    if (mode === "repair" && !hasPhoto) {
      return NextResponse.json({ error: "Фотография не передана" }, { status: 400 });
    }

    if (mode === "body-dimensions" && (!sendMessage || hasPhoto || !name || !phone || !description)) {
      return NextResponse.json(
        { error: "Для покупки укажите имя, телефон и комплект без фотографий" },
        { status: 400 }
      );
    }

    if (mode === "body-dimensions-search" && (!sendMessage || hasPhoto || !name || !phone || !description)) {
      return NextResponse.json(
        { error: "Для поиска укажите имя, телефон, автомобиль и что нужно найти без фотографий" },
        { status: 400 }
      );
    }

    if (hasPhoto && photo.size > MAX_SINGLE_PHOTO_SIZE) {
      return NextResponse.json(
        { error: "Размер одной фотографии не должен превышать 10 МБ" },
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
      let message = mode === "body-dimensions-search"
        ? "🔎 ЗАЯВКА НА ПОИСК КУЗОВНЫХ РАЗМЕРОВ\n\n"
        : "🚗 НОВАЯ ЗАЯВКА С САЙТА\n\n";
      message += `👤 Имя: ${name || "не указано"}\n`;
      message += `📞 Телефон: ${phone || "не указано"}\n`;

      if (description) {
        message += `\n📝 ${mode === "body-dimensions-search" ? "Автомобиль и что нужно найти" : mode === "body-dimensions" ? "Заявка на покупку" : "Что произошло"}:\n${description}`;
      }

      if (issueUrl) {
        // Text fallback works even if the existing relay strips reply_markup.
        message += "\n\nТолько для мастера. После проверки оплаты: " + issueUrl + "\nСлужебная ссылка действует 7 дней. Клиенту отправляйте только созданную ссылку доступа.";
      }
      const messageForm = new FormData();
      messageForm.append("method", "sendMessage");
      messageForm.append("chat_id", chatId);
      messageForm.append("text", message);
      if (issueUrl) {
        messageForm.append("disable_web_page_preview", "true");
        messageForm.append("reply_markup", JSON.stringify({ inline_keyboard: [[{ text: "Выдать доступ на 24 часа", url: issueUrl }]] }));
      }

      const messageResponse = await fetch(RELAY_URL, {
        method: "POST",
        headers: {
          "X-Relay-Secret": relaySecret,
        },
        body: messageForm,
      });

      const relayResult = await messageResponse.json().catch(() => null);
      if (!messageResponse.ok || relayResult?.ok === false) {
        console.error("Relay sendMessage failed, HTTP status:", messageResponse.status);

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
      });

      if (!photoResponse.ok) {
        const errorText = await photoResponse.text();
        console.error("Relay sendPhoto error:", errorText);

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

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "send-telegram",
  });
}
