const fs = require("fs");
const path = require("path");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const ROOT = process.env.BODY_META_ROOT || path.join(process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`, "WEB_EXPORT_V2");
const OUT = path.join(process.cwd(), "BODY_JSON_PATH_INSPECTION.txt");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.toLowerCase().endsWith(".json")) out.push(full);
  }
  return out;
}

function collectStrings(value, keyPath = "", out = []) {
  if (typeof value === "string") {
    if (
      value.toLowerCase().includes(".svg") ||
      value.toLowerCase().includes("asset") ||
      value.includes("\\") ||
      value.includes("/")
    ) {
      out.push({ keyPath, value });
    }
    return out;
  }

  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, `${keyPath}[${i}]`, out));
    return out;
  }

  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      collectStrings(v, keyPath ? `${keyPath}.${k}` : k, out);
    }
  }

  return out;
}

const files = walk(ROOT);

let parsed = 0;
let bad = 0;
let svgRefs = 0;
const samples = [];
const rootKeys = new Map();

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    parsed++;

    for (const key of Object.keys(data)) {
      rootKeys.set(key, (rootKeys.get(key) || 0) + 1);
    }

    const strings = collectStrings(data);

    for (const item of strings) {
      if (item.value.toLowerCase().includes(".svg")) {
        svgRefs++;

        if (samples.length < 100) {
          samples.push({
            json: path.relative(ROOT, file),
            key: item.keyPath,
            value: item.value,
          });
        }
      }
    }
  } catch {
    bad++;
  }
}

const lines = [];

lines.push(`JSON всего: ${files.length}`);
lines.push(`Прочитано: ${parsed}`);
lines.push(`Ошибок JSON: ${bad}`);
lines.push(`Найдено ссылок/путей с .svg: ${svgRefs}`);
lines.push("");

lines.push("=== КОРНЕВЫЕ ПОЛЯ JSON ===");
for (const [key, count] of [...rootKeys.entries()].sort((a,b) => b[1]-a[1])) {
  lines.push(`${key}: ${count}`);
}

lines.push("");
lines.push("=== ПЕРВЫЕ 100 SVG-ССЫЛОК ===");

for (const s of samples) {
  lines.push("");
  lines.push(`JSON: ${s.json}`);
  lines.push(`FIELD: ${s.key}`);
  lines.push(`VALUE: ${s.value}`);
}

if (!dryRun) fs.writeFileSync(OUT, lines.join("\r\n"), "utf8");

console.log(`JSON всего: ${files.length}`);
console.log(`Прочитано: ${parsed}`);
console.log(`Ошибок: ${bad}`);
console.log(`SVG-ссылок найдено: ${svgRefs}`);
console.log(dryRun ? "DRY RUN — файлы не записывались." : `Отчёт: ${OUT}`);

if (samples.length) {
  console.log("");
  console.log("Первые 5:");
  for (const s of samples.slice(0,5)) {
    console.log(`${s.key} -> ${s.value}`);
  }
}
