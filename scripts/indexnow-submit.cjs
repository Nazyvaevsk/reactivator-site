const fs = require("node:fs");
const path = require("node:path");

const ORIGIN = "https://www.reactivator55.ru";
const ENDPOINT = "https://yandex.com/indexnow";
const KEY = "04a8dbffa3444bf8393a3913d0ef8f39";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const BATCH_SIZE = 10000;

// Explicit public route families; extend deliberately when adding new sections.
// Do not check page existence: deleted public URLs (404/410) are valid submissions.
const PUBLIC_PATHS = [
  /^\/$/,
  /^\/(?:about|contacts|works|technology)$/,
  /^\/services(?:\/[a-z0-9-]+)?$/,
  /^\/body-dimensions(?:\/[a-z0-9_-]+(?:\/[1-9][0-9]*)?)?$/,
];
const INTERNAL_SEGMENTS = new Set([
  "api", "access", "issue", "groups", "admin", "private", "internal",
  "download", "preview", "previews", "assets", "login", "logout", "auth",
]);

function validateUrl(value) {
  // Reject encoded paths, normalization tricks, query strings and fragments.
  // Current canonical public URLs use plain ASCII slugs.
  if (typeof value !== "string" || !value.startsWith(`${ORIGIN}/`) ||
      /[\s\\%?#]/.test(value)) {
    throw new Error("Разрешены только абсолютные https://www.reactivator55.ru/ URL без query, fragment и кодирования.");
  }
  const url = new URL(value);
  if (url.origin !== ORIGIN || url.username || url.password || url.href !== value) {
    throw new Error("URL должен точно соответствовать основному хосту и каноническому пути.");
  }
  const segments = url.pathname.toLowerCase().split("/");
  if (segments.some(segment => INTERNAL_SEGMENTS.has(segment)) ||
      !PUBLIC_PATHS.some(pattern => pattern.test(url.pathname))) {
    throw new Error("URL не относится к разрешённым публичным страницам (служебные пути, файлы и магазин исключены).");
  }
  return url.href;
}

function parseArgs(args) {
  const urls = [];
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--file") {
      const filename = args[++i];
      if (!filename || filename.startsWith("--")) throw new Error("После --file укажите txt-файл.");
      const lines = fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
      urls.push(...lines.map(line => line.trim()).filter(line => line && !line.startsWith("#")));
    } else if (arg.startsWith("--")) throw new Error(`Неизвестный параметр: ${arg}`);
    else urls.push(arg);
  }
  if (!urls.length) throw new Error("Укажите хотя бы один URL или --file urls.txt; для проверки добавьте --dry-run.");
  // Validate the ENTIRE input before any network request. Never print access tokens.
  const validated = urls.map((url, index) => {
    try { return validateUrl(url); }
    catch (error) { throw new Error(`URL №${index + 1}: ${error.message}`); }
  });
  return { dryRun, urls: [...new Set(validated)] };
}

function makeBatches(urls) {
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push({ host: new URL(ORIGIN).host, key: KEY, keyLocation: KEY_LOCATION,
      urlList: urls.slice(i, i + BATCH_SIZE) });
  }
  return batches;
}

async function main(args, request = fetch) {
  if (args.includes("--help")) {
    console.log("npm run indexnow -- <url> [<url> ...]\nnpm run indexnow:file -- urls.txt [--dry-run]\nnpm run indexnow:dry -- <url> [--file urls.txt]\nФайл: один URL на строку; пустые строки и комментарии # пропускаются.");
    return;
  }
  const { dryRun, urls } = parseArgs(args);
  const localKey = fs.readFileSync(path.join(__dirname, "..", "public", `${KEY}.txt`), "utf8").trim();
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY) || localKey !== KEY) {
    throw new Error("Некорректный локальный key-файл.");
  }
  const batches = makeBatches(urls);
  console.log(`${dryRun ? "DRY-RUN" : "IndexNow"}: ${urls.length} уникальных URL, батчей: ${batches.length}.`);
  if (dryRun) {
    for (const body of batches) console.log(`POST ${ENDPOINT}\n${JSON.stringify(body, null, 2)}`);
    console.log("Сетевых запросов не выполнено. Локальный key-файл проверен.");
    return;
  }
  const keyResponse = await request(KEY_LOCATION, { redirect: "error", signal: AbortSignal.timeout(30000) });
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== KEY) {
    throw new Error("Публичный key-файл недоступен или не совпадает. Сначала опубликуйте ключ на основном хосте.");
  }
  for (let i = 0; i < batches.length; i++) {
    let response;
    try {
      response = await request(ENDPOINT, {
        method: "POST", redirect: "error", signal: AbortSignal.timeout(30000),
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(batches[i]),
      });
    } catch {
      throw new Error(`Батч ${i + 1}: сетевая ошибка/тайм-аут; результат неизвестен. Остановлено без повторов; ранее обработано батчей: ${i}.`);
    }
    if (response.status !== 200 && response.status !== 202) {
      const reasons = { 403: "ключ не прошёл проверку", 422: "некорректные параметры", 429: "лимит запросов; повторите позже" };
      throw new Error(`Батч ${i + 1}: HTTP ${response.status} (${reasons[response.status] || "ошибка отправки"}). Остановлено без повторов; ранее обработано батчей: ${i}.`);
    }
    console.log(`Батч ${i + 1}/${batches.length}: HTTP ${response.status} — ${response.status === 202 ? "ключ ожидает проверки Яндексом" : "адреса переданы"}.`);
  }
  console.log("Отправка завершена. Приём запроса не гарантирует индексирование страниц.");
}

if (require.main === module) {
  main(process.argv.slice(2)).catch(error => {
    console.error(`IndexNow: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { validateUrl, parseArgs, makeBatches, main };
