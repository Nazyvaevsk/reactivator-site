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
    const description = String(formData.get("description") || "").trim();

    const sendMessage =
      String(formData.get("sendMessage") || "true") === "true";

    const mode = String(formData.get("mode") || "repair");

    if (mode !== "repair" && mode !== "body-dimensions") {
      return NextResponse.json({ error: "Неизвестный тип заявки" }, { status: 400 });
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
      let message = "🚗 НОВАЯ ЗАЯВКА С САЙТА\n\n";
      message += `👤 Имя: ${name || "не указано"}\n`;
      message += `📞 Телефон: ${phone || "не указано"}\n`;

      if (description) {
        message += `\n📝 ${mode === "body-dimensions" ? "Заявка на покупку" : "Что произошло"}:\n${description}`;
      }

      const messageForm = new FormData();
      messageForm.append("method", "sendMessage");
      messageForm.append("chat_id", chatId);
      messageForm.append("text", message);

      const messageResponse = await fetch(RELAY_URL, {
        method: "POST",
        headers: {
          "X-Relay-Secret": relaySecret,
        },
        body: messageForm,
      });

      if (!messageResponse.ok) {
        const errorText = await messageResponse.text();
        console.error("Relay sendMessage error:", errorText);

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
  } catch (error) {
    console.error("send-telegram error:", error);

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
