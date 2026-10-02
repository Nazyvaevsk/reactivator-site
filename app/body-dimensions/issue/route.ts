import crypto from "node:crypto";
import { bodyIssueConfig, createIssuedBodyAccess, verifyBodyIssueToken } from "@/lib/bodyIssue";
import { getBodyDimensionsGroup } from "@/lib/bodyDimensionsData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

// A standalone document intentionally avoids the site's analytics and third-party scripts.
export function GET() {
  const nonce = crypto.randomBytes(18).toString("base64");
  return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Выдача доступа</title>
<style nonce="${nonce}">body{font:18px system-ui;background:#111;color:#eee;margin:0;padding:28px}main{max-width:620px;margin:40px auto}button,textarea{font:inherit;box-sizing:border-box;width:100%;padding:16px;margin:12px 0;border-radius:12px}button{background:#ff8a28;border:0;cursor:pointer}button:disabled{opacity:.5}textarea{height:160px;background:#222;color:white}p{line-height:1.5}small{color:#bbb}</style></head>
<body><main><h1>Выдать доступ на 24 часа</h1><p id="group">Проверяем комплект…</p>
<p>Сначала проверьте поступление оплаты. Нажатие кнопки ниже создаст клиентскую ссылку на 24 часа.</p>
<button id="issue" disabled>Оплата получена — создать и скопировать ссылку</button>
<p id="status" role="status" aria-live="polite"></p><section id="result" hidden>
<label for="link">Ссылка для клиента</label><textarea id="link" readonly></textarea>
<button id="copy">Скопировать ссылку</button></section>
<small>Это служебная страница. Не пересылайте клиенту кнопку из уведомления. Отправьте только созданную клиентскую ссылку. После перезагрузки откройте страницу снова из Telegram.</small>
<noscript>Для выдачи ссылки включите JavaScript.</noscript></main>
<script nonce="${nonce}">
const token = location.hash.slice(1);
history.replaceState(null, '', location.pathname);
const button = document.getElementById('issue'), status = document.getElementById('status'), link = document.getElementById('link');
let issued = false;
async function call(action) {
 const response = await fetch(location.pathname, {method:'POST', cache:'no-store', credentials:'omit', headers:{'Content-Type':'application/json'}, body:JSON.stringify({token,action})});
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'Не удалось выполнить действие.');
 return data;
}
async function copy() {
 try { await navigator.clipboard.writeText(link.value); status.textContent = 'Ссылка скопирована. Отправьте её клиенту.'; }
 catch { link.focus(); link.select(); status.textContent = 'Автокопирование недоступно. Скопируйте выделенную ссылку вручную или нажмите «Скопировать ссылку».'; }
}
call('inspect').then(data => {document.getElementById('group').textContent=data.label;button.disabled=false;}).catch(error => {document.getElementById('group').textContent='Выдача недоступна';status.textContent=error.message;});
button.addEventListener('click', async () => {
 if (issued) return;
 button.disabled=true;status.textContent='Создаём ссылку…';
 try {const data=await call('issue');issued=true;link.value=data.url;document.getElementById('result').hidden=false;button.textContent='Доступ создан до '+new Date(data.expiresAt*1000).toLocaleString('ru-RU');await copy();}
 catch(error){status.textContent=error.message;button.disabled=false;}
});
document.getElementById('copy').addEventListener('click', copy);
</script></body></html>`, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'` } });
}

export async function POST(request: Request) {
  const json = (data: unknown, status = 200) => Response.json(data, { status, headers });
  try {
    const { origin } = bodyIssueConfig();
    if (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") {
      return json({ error: "Откройте страницу из Telegram на основном адресе сайта." }, 403);
    }
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Неверный запрос" }, 415);
    // Bound actual streamed bytes as well as Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Неверный запрос" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return json({ error: "Запрос слишком большой" }, 413); }
      chunks.push(value);
    }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return json({ error: "Неверный запрос" }, 400); }
    if (!body || (body.action !== "inspect" && body.action !== "issue")) return json({ error: "Неверное действие" }, 400);
    const groupId = verifyBodyIssueToken(body.token);
    if (!groupId) return json({ error: "Служебная ссылка недействительна или истекла. Используйте ручной генератор." }, 403);
    const group = getBodyDimensionsGroup(groupId);
    if (!group) return json({ error: "Комплект не найден" }, 404);
    if (body.action === "inspect") return json({ label: `${group.make} ${group.model} ${group.year} / ${group.variant || '—'} · ${group.groupId} · ${group.sheetCount} листов · 590 ₽` });
    return json(createIssuedBodyAccess(groupId));
  } catch {
    // Never log request bodies, signed URLs or configuration secrets.
    return json({ error: "Выдача временно недоступна. Проверьте настройки сервера." }, 503);
  }
}
