import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const MAX_TELEGRAM_PHOTO_SIZE = 9 * 1024 * 1024;

async function preparePhoto(file: File): Promise<File> {
  const originalBuffer = Buffer.from(await file.arrayBuffer());

  if (originalBuffer.length <= MAX_TELEGRAM_PHOTO_SIZE) {
    return file;
  }

  let width = 2560;

  const qualities = [82, 75, 68, 60, 52, 45];

  for (const quality of qualities) {
    const compressed = await sharp(originalBuffer)
      .rotate()
      .resize({
        width,
        height: width,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();

    if (compressed.length <= MAX_TELEGRAM_PHOTO_SIZE) {
      return new File(
        [compressed],
        `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
        {
          type: "image/jpeg",
        }
      );
    }
  }

  width = 2048;

  for (const quality of [70, 60, 50, 40]) {
    const compressed = await sharp(originalBuffer)
      .rotate()
      .resize({
        width,
        height: width,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();

    if (compressed.length <= MAX_TELEGRAM_PHOTO_SIZE) {
      return new File(
        [compressed],
        `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
        {
          type: "image/jpeg",
        }
      );
    }
  }

  throw new Error(
    `Не удалось сжать фотографию "${file.name}" до допустимого размера`
  );
}

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
        const preparedPhoto = await preparePhoto(photo);

        console.log(
          `Фото ${photo.name}: ${(photo.size / 1024 / 1024).toFixed(2)} MB → ${(preparedPhoto.size / 1024 / 1024).toFixed(2)} MB`
        );

        const telegramForm = new FormData();

        telegramForm.append("chat_id", chatId);
        telegramForm.append(
          "photo",
          preparedPhoto,
          preparedPhoto.name
        );

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
