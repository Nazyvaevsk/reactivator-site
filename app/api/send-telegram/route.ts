import { NextRequest, NextResponse } from "next/server";

const MAX_PHOTOS = 10;
const MAX_TOTAL_PHOTO_SIZE = 100 * 1024 * 1024;
const MAX_SINGLE_PHOTO_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.MASTER_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { error: "Telegram не настроен на сервере" },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const description = String(formData.get("description") || "").trim();

    const sendMessage = String(formData.get("sendMessage") || "true") === "true";

    const photo = formData.get("photo");

    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json(
        { error: "Фотография не передана" },
        { status: 400 }
      );
    }

    if (photo.size > MAX_SINGLE_PHOTO_SIZE) {
      return NextResponse.json(
        { error: "Размер одной фотографии не должен превышать 10 МБ" },
        { status: 400 }
      );
    }

    if (sendMessage) {
      let message = "🚗 НОВАЯ ЗАЯВКА С САЙТА\n\n";
      message += `👤 Имя: ${name || "не указано"}\n`;
      message += `📞 Телефон: ${phone || "не указано"}\n`;

      if (description) {
        message += `\n📝 Что произошло:\n${description}`;
      }

      const sendMessageResponse = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        }
      );

      if (!sendMessageResponse.ok) {
        const errorText = await sendMessageResponse.text();
        console.error("Telegram sendMessage error:", errorText);

        return NextResponse.json(
          { error: "Не удалось отправить заявку в Telegram" },
          { status: 500 }
        );
      }
    }

    console.log(
      `Фото: ${photo.name}: ${(photo.size / 1024 / 1024).toFixed(2)} MB`
    );

    const telegramForm = new FormData();

    telegramForm.append("chat_id", chatId);
    telegramForm.append("photo", photo, photo.name);

    const photoResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto`,
      {
        method: "POST",
        body: telegramForm,
      }
    );

    if (!photoResponse.ok) {
      const errorText = await photoResponse.text();
      console.error("Telegram sendPhoto error:", errorText);

      return NextResponse.json(
        { error: "Не удалось отправить фотографию в Telegram" },
        { status: 500 }
      );
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
