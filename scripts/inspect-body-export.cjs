const fs = require("fs");
const path = require("path");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const ROOT = process.env.BODY_META_ROOT || path.join(process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`, "WEB_EXPORT_V2");
const OUT = path.join(process.cwd(), "BODY_EXPORT_INSPECTION.txt");

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, result);
    } else {
      result.push(full);
    }
  }

  return result;
}

if (!fs.existsSync(ROOT)) {
  console.error("НЕ НАЙДЕНА ПАПКА:");
  console.error(ROOT);
  process.exit(1);
}

console.log("Сканирую WEB_EXPORT_V2...");

const files = walk(ROOT);

const svg = files.filter(f => f.toLowerCase().endsWith(".svg"));
const json = files.filter(f => f.toLowerCase().endsWith(".json"));
const webp = files.filter(f => f.toLowerCase().endsWith(".webp"));

const lines = [];

lines.push(`ROOT: ${ROOT}`);
lines.push(`ВСЕГО ФАЙЛОВ: ${files.length}`);
lines.push(`SVG: ${svg.length}`);
lines.push(`JSON: ${json.length}`);
lines.push(`WEBP: ${webp.length}`);
lines.push("");
lines.push("=== ПЕРВЫЕ 50 SVG ===");

for (const file of svg.slice(0, 50)) {
  const rel = path.relative(ROOT, file);
  const size = fs.statSync(file).size;

  lines.push(`${rel} | ${size} bytes`);
}

lines.push("");
lines.push("=== ВЕРХНИЙ УРОВЕНЬ ===");

for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  lines.push(`${entry.isDirectory() ? "[DIR]" : "[FILE]"} ${entry.name}`);
}

if (!dryRun) fs.writeFileSync(OUT, lines.join("\r\n"), "utf8");

console.log("");
console.log(`Всего файлов: ${files.length}`);
console.log(`SVG: ${svg.length}`);
console.log(`JSON: ${json.length}`);
console.log(`WEBP: ${webp.length}`);
console.log("");
console.log(dryRun ? "DRY RUN — файлы не записывались." : `Отчёт: ${OUT}`);
