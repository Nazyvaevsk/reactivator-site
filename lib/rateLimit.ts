import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";

// One Node process behind Caddy. Restart resets limits; replicas need a shared store.
const buckets = new Map<string, { count: number; reset: number }>();
const MAX_BUCKETS = 10000;
export function consumeLimit(key: string, limit: number, windowMs: number, now = Date.now()): number {
  for (const [id, bucket] of buckets) if (bucket.reset <= now) buckets.delete(id);
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_BUCKETS) return Math.ceil(windowMs / 1000);
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(key, bucket);
  }
  if (bucket.count >= limit) return Math.max(1, Math.ceil((bucket.reset - now) / 1000));
  bucket.count++;
  return 0;
}
export function clientKey(request: Request): string {
  // Trust only the rightmost hop supplied by Caddy, never the caller's leftmost value.
  // The application port MUST be reachable only by the reverse proxy.
  const raw = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ?? "";
  if (!isIP(raw)) return "unknown";
  const normalized = raw.includes(":") ? new URL("http://[" + raw + "]").hostname : raw;
  return createHash("sha256").update(normalized).digest("hex");
}
export function rateLimit(request: Request, scope: string, limit: number, windowMs: number, globalLimit: number): Response | null {
  const retry = consumeLimit(scope + ":all", globalLimit, windowMs) ||
    consumeLimit(scope + ":" + clientKey(request), limit, windowMs);
  return retry ? Response.json({ error: "Слишком много запросов. Попробуйте позже." }, {
    status: 429, headers: { "Retry-After": String(retry), "Cache-Control": "private, no-store" },
  }) : null;
}

const active = new Map<string, number>();
export async function withCapacity(scope: string, maximum: number, run: () => Promise<Response>): Promise<Response> {
  const count = active.get(scope) ?? 0;
  if (count >= maximum) return Response.json({ error: "Сервер занят. Попробуйте позже." }, {
    status: 429, headers: { "Retry-After": "15", "Cache-Control": "private, no-store" },
  });
  active.set(scope, count + 1);
  try { return await run(); }
  finally { active.set(scope, (active.get(scope) ?? 1) - 1); }
}
