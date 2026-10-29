export const PHOTO_WORKER_URL = "/photo-preparation-v1.js";

// One disposable worker per photo bounds lifetime of WASM/native pixel memory.
// Terminating it also stops synchronous decoding if an input hangs the decoder.
export function preparePhotoForUpload(file: File, timeoutMs = 90_000): Promise<File> {
  return new Promise((resolve, reject) => {
    let worker: Worker | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = (error?: string, blob?: Blob) => {
      clearTimeout(timer);
      worker?.terminate();
      if (error) reject(new Error(error));
      else if (blob?.type === "image/jpeg" && blob.size > 0 && blob.size <= 8 * 1024 * 1024) {
        resolve(new File([blob], "photo.jpg", { type: "image/jpeg", lastModified: 0 }));
      } else reject(new Error("Не удалось подготовить фотографию. Попробуйте выбрать её ещё раз."));
    };
    try {
      worker = new Worker(PHOTO_WORKER_URL);
      timer = setTimeout(() => finish("Подготовка фотографии заняла слишком много времени. Попробуйте ещё раз."), timeoutMs);
      worker.onerror = () => finish("Не удалось подготовить фотографию. Проверьте соединение и попробуйте ещё раз.");
      worker.onmessageerror = () => finish("Не удалось получить подготовленную фотографию. Попробуйте ещё раз.");
      worker.onmessage = event => {
        if (event.data?.ok === true) finish(undefined, event.data.blob);
        else finish(event.data?.code === "unsupported"
          ? "Этот файл не является фотографией. Выберите снимок из камеры или галереи."
          : "Не удалось прочитать фотографию. Выберите её ещё раз или сделайте новый снимок.");
      };
      worker.postMessage(file);
    } catch { finish("Не удалось запустить подготовку фотографий. Обновите страницу и попробуйте ещё раз."); }
  });
}
