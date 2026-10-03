const fs = require("fs");
const path = require("path");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const BASE = process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`;
const META = process.env.BODY_META_ROOT || path.join(BASE, "WEB_EXPORT_V2");

const ROOTS = [
  "FINAL_REACTIVATOR_CATALOG_V2",
  "REACTIVATOR_PIPELINE",
  "REACTIVATOR_RASTER_PIPELINE",
];

const OUT = path.join(process.cwd(), "BODY_ASSET_MATCH_REPORT.txt");

function walkJson(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      walkJson(full, out);
    } else if (e.name.toLowerCase().endsWith(".json")) {
      out.push(full);
    }
  }

  return out;
}

const jsonFiles = walkJson(META);

const keys = new Set();

for (const file of jsonFiles) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const sheet of data.sheets || []) {
    if (sheet.assetKey) {
      keys.add(sheet.assetKey.replace(/\//g, path.sep));
    }
  }
}

const assetKeys = [...keys];

const stats = {};
for (const root of ROOTS) {
  stats[root] = {
    found: 0,
    bytes: 0,
    samples: [],
  };
}

const missing = [];
const multi = [];

for (const key of assetKeys) {
  const foundIn = [];

  for (const root of ROOTS) {
    const full = path.join(BASE, root, key);

    if (fs.existsSync(full)) {
      foundIn.push(root);

      const size = fs.statSync(full).size;

      stats[root].found++;
      stats[root].bytes += size;

      if (stats[root].samples.length < 10) {
        stats[root].samples.push(key);
      }
    }
  }

  if (foundIn.length === 0) {
    missing.push(key);
  }

  if (foundIn.length > 1) {
    multi.push({
      key,
      roots: foundIn,
    });
  }
}

const lines = [];

lines.push(`Ожидаемых уникальных assetKey: ${assetKeys.length}`);
lines.push("");

for (const root of ROOTS) {
  lines.push(`=== ${root} ===`);
  lines.push(`Найдено: ${stats[root].found} / ${assetKeys.length}`);
  lines.push(`Размер совпавших файлов: ${(stats[root].bytes / 1024 / 1024).toFixed(2)} MB`);

  for (const s of stats[root].samples) {
    lines.push(`  ${s}`);
  }

  lines.push("");
}

lines.push(`Не найдено ни в одном root: ${missing.length}`);
for (const m of missing.slice(0, 100)) {
  lines.push(`  ${m}`);
}

lines.push("");
lines.push(`Найдено одновременно в нескольких root: ${multi.length}`);
for (const m of multi.slice(0, 50)) {
  lines.push(`  ${m.key} -> ${m.roots.join(", ")}`);
}

if (!dryRun) fs.writeFileSync(OUT, lines.join("\r\n"), "utf8");

console.log(`Ожидаемых assetKey: ${assetKeys.length}`);
console.log("");

for (const root of ROOTS) {
  console.log(`${root}: ${stats[root].found} / ${assetKeys.length}`);
}

console.log("");
console.log(`Не найдено вообще: ${missing.length}`);
console.log(`Есть сразу в нескольких местах: ${multi.length}`);
console.log("");
console.log(dryRun ? "DRY RUN — файлы не записывались." : `Отчёт: ${OUT}`);
