// Only transport metadata may be logged. Never include bodies, files or server error text.
export class ApplicationRequestError extends Error {
  constructor(message: string, public readonly diagnostic: {
    kind: string; status?: number; requestId?: string; contentType?: string;
  }) { super(message); }
}

const statusMessage = (status: number) => {
  if (status === 413) return "Сервер отклонил размер фотографии. Уменьшите её и попробуйте снова.";
  if (status === 429) return "Слишком много запросов. Подождите несколько минут перед повторной отправкой.";
  if (status === 403) return "Сервер запретил отправку. Обновите страницу или свяжитесь с мастером.";
  return "Сервер не подтвердил доставку заявки. Повторите с этой же формы позже; если ошибка повторяется, свяжитесь с мастером.";
};

export async function sendApplicationRequest(form: FormData, timeoutMs = 75_000): Promise<{ uploadToken?: string }> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new ApplicationRequestError("Время ожидания истекло. Доставка не подтверждена. Повторите с этой же формы позже или свяжитесь с мастером.", { kind: "timeout" }));
    }, timeoutMs);
  });
  const run = async () => {
    const response = await fetch("/api/send-telegram", { method: "POST", body: form, signal: controller.signal });
    const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
    const rawId = response.headers.get("x-request-id") ?? "";
    const diagnostic = { status: response.status, contentType: /^[\w/+.-]{1,80}$/.test(contentType) ? contentType : "other",
      requestId: /^[a-f0-9-]{36}$/i.test(rawId) ? rawId : undefined };
    const text = await response.text();
    let result;
    if (contentType === "application/json" && text.trim()) {
      try { result = JSON.parse(text); } catch { /* Proxy/truncated response. */ }
    }
    if (!response.ok) {
      // Only our JSON handler's error is presented; never log it or echo proxy HTML.
      const message = diagnostic.requestId && typeof result?.error === "string"
        ? result.error : statusMessage(response.status);
      throw new ApplicationRequestError(`${message} (HTTP ${response.status})`, { ...diagnostic, kind: "http" });
    }
    if (result?.success !== true || (form.has("photo") &&
        (result.submissionId !== form.get("submissionId") || !/^[a-f0-9]{64}$/.test(result.uploadToken ?? "")))) {
      throw new ApplicationRequestError(statusMessage(response.status), { ...diagnostic, kind: "invalid-response" });
    }
    return { uploadToken: result.uploadToken as string | undefined };
  };
  try { return await Promise.race([run(), deadline]); }
  catch (error) {
    if (error instanceof ApplicationRequestError) throw error;
    throw new ApplicationRequestError("Не удалось получить ответ сервера. Проверьте соединение и повторите с этой же формы позже.", { kind: "network" });
  } finally { clearTimeout(timer); }
}
