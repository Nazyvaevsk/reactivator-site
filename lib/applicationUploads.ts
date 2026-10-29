import "server-only";
import { createHash, randomBytes } from "node:crypto";

export class SubmissionError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

type Submission = {
  fingerprint: string; token: string; expires: number; busy: boolean;
  text: "new" | "sent" | "uncertain"; photos: Map<number, string>;
  uncertainPhotos: Set<number>; maximum: number; bytes: number;
};
// One process, matching the existing limiter. No PII, file bytes or signatures retained.
const submissions = new Map<string, Submission>();
const fingerprints = new Map<string, string>();
const TTL = 15 * 60_000;
const MAX_SUBMISSIONS = 1000;
export function digest(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function acquireSubmission(id: string, fingerprint: string, token: string, first: boolean, maximum: number, now = Date.now()) {
  for (const [key, item] of submissions) if (item.expires <= now && !item.busy) {
    submissions.delete(key);
    if (fingerprints.get(item.fingerprint) === key) fingerprints.delete(item.fingerprint);
  }
  let item = submissions.get(id);
  if (item && item.expires <= now) throw new SubmissionError(409, "Срок загрузки истёк. Откройте новую заявку.");
  if (!item) {
    if (!first || token) throw new SubmissionError(403, "Сначала отправьте заявку.");
    if (fingerprints.has(fingerprint)) throw new SubmissionError(409, "Такая заявка уже отправлена. Повторите позже.");
    if (submissions.size >= MAX_SUBMISSIONS) throw new SubmissionError(429, "Сервер занят. Повторите позже.");
    item = { fingerprint, token: randomBytes(32).toString("hex"), expires: now + TTL,
      busy: false, text: "new", photos: new Map(), uncertainPhotos: new Set(), maximum, bytes: 0 };
    submissions.set(id, item);
    fingerprints.set(fingerprint, id);
  }
  if (item.fingerprint !== fingerprint || item.maximum !== maximum || (!first && item.token !== token)) {
    throw new SubmissionError(403, "Фотографии не относятся к этой заявке.");
  }
  if (item.busy) throw new SubmissionError(409, "Заявка уже обрабатывается. Подождите.");
  if (item.text === "uncertain") throw new SubmissionError(409, "Доставка не подтверждена. Не повторяйте заявку, свяжитесь с мастером.");
  item.busy = true;
  return item;
}

export async function validatePhoto(file: File): Promise<{ bytes: Buffer; hash: string; filename: string; mime: string }> {
  if (!file.size || file.size > 10 * 1024 * 1024) throw new SubmissionError(400, "Фотография должна быть не больше 10 МБ.");
  const bytes = Buffer.from(await file.arrayBuffer());
  // Load inside the handler so a missing native binary produces diagnostic JSON,
  // rather than failing route-module initialization with an empty framework 500.
  let sharp: typeof import("sharp").default;
  try { sharp = (await import("sharp")).default; }
  catch { throw new SubmissionError(503, "Обработка фотографий временно недоступна. Свяжитесь с мастером."); }
  // Decode with an existing dependency; bound pixels/time and reject SVG/animation.
  try {
    const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: "warning", animated: true }).timeout({ seconds: 5 });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format) ||
        !metadata.width || !metadata.height || (metadata.pages ?? 1) !== 1) throw new Error("Unsupported image");
    // stats forces full decoding; metadata alone accepts truncated/corrupt pixel data.
    await image.stats();
    const extension = metadata.format === "jpeg" ? "jpg" : metadata.format;
    return { bytes, hash: digest(bytes), filename: "photo." + extension, mime: "image/" + metadata.format };
  } catch { throw new SubmissionError(400, "Не удалось прочитать фото. Используйте JPEG, PNG или WebP без анимации."); }
}
