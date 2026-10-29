import "server-only";

export class BodyReadError extends Error {
  constructor(public status: number) { super("Request body rejected"); }
}

// A deadline covers the whole stream, not just each individual chunk.
export async function readBoundedBody(request: Pick<Request, "body" | "headers">, maximum: number, timeoutMs = 15_000): Promise<Buffer> {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maximum) throw new BodyReadError(413);
  const reader = request.body?.getReader();
  if (!reader) throw new BodyReadError(400);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new BodyReadError(408));
      void reader.cancel().catch(() => {});
    }, timeoutMs);
  });
  const read = async () => {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        void reader.cancel().catch(() => {});
        throw new BodyReadError(413);
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks, size);
  };
  try { return await Promise.race([read(), deadline]); }
  finally { clearTimeout(timer); }
}
