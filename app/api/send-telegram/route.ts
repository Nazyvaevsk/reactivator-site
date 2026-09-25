import { NextRequest, NextResponse } from "next/server";

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

    const photos = formData
      .getAll("photos")
      .filter(
        (item): item is File =>
          item instanceof File && item.size > 0
      );

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

    for (const photo of photos) {
      try {
        console.log(
          `Фото ${photo.name}: ${(photo.size / 1024 / 1024).toFixed(2)} MB`
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
        }
      } catch (photoError) {
        console.error(
          `Ошибка обработки фотографии ${photo.name}:`,
          photoError
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
