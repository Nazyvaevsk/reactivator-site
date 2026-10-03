const fs = require("fs");
const path = require("path");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const BASE = process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`;
const META_ROOT = process.env.BODY_META_ROOT || path.join(BASE, "WEB_EXPORT_V2");
const PREVIEW_ROOT = process.env.BODY_PREVIEW_ROOT || path.join(process.cwd(), "BODY_PREVIEWS_GENERATED");
const REPORT = path.join(process.cwd(), "BODY_PREVIEW_COMPARE_REPORT.txt");

function walk(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, filter, out);
    } else if (!filter || filter(full)) {
      out.push(full);
    }
  }

  return out;
}

function walkJson(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkJson(full, out);
    } else if (entry.name.toLowerCase().endsWith(".json")) {
      out.push(full);
    }
  }

  return out;
}

function previewPathFromAssetKey(assetKey, logicalSheet) {
  const normalized = assetKey.replace(/\\/g, "/");
  const parts = normalized.split("/");

  if (parts[0].toLowerCase() === "groups") {
    parts.shift();
  }

  parts.pop();

  return path.join(
    ...parts,
    `sheet_${String(logicalSheet).padStart(3, "0")}.webp`
  ).toLowerCase();
}

const expected = new Set();

for (const jsonFile of walkJson(META_ROOT)) {
  const group = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  for (const sheet of group.sheets || []) {
    if (!sheet.assetKey) continue;
    expected.add(previewPathFromAssetKey(sheet.assetKey, sheet.sheet));
  }
}

const actualFiles = walk(
  PREVIEW_ROOT,
  f => f.toLowerCase().endsWith(".webp")
);

const actual = new Map();

for (const file of actualFiles) {
  const rel = path.relative(PREVIEW_ROOT, file).toLowerCase();
  actual.set(rel, file);
}

const missing = [];
const extra = [];

for (const rel of expected) {
  if (!actual.has(rel)) {
    missing.push(rel);
  }
}

for (const [rel] of actual) {
  if (!expected.has(rel)) {
    extra.push(rel);
  }
}

const lines = [
  `Ожидаемых уникальных превью: ${expected.size}`,
  `Фактически WebP: ${actualFiles.length}`,
  `Отсутствуют: ${missing.length}`,
  `Лишние: ${extra.length}`,
  "",
  "=== MISSING ===",
  ...missing,
  "",
  "=== EXTRA ===",
  ...extra,
];

if (!dryRun) fs.writeFileSync(REPORT, lines.join("\r\n"), "utf8");

console.log(`Ожидаемых уникальных превью: ${expected.size}`);
console.log(`Фактически WebP: ${actualFiles.length}`);
console.log(`Отсутствуют: ${missing.length}`);
console.log(`Лишние: ${extra.length}`);
console.log("");
console.log(dryRun ? "DRY RUN — файлы не записывались." : `Отчёт: ${REPORT}`);

if (missing.length) {
  console.log("");
  console.log("Отсутствующие:");
  for (const x of missing) console.log(x);
}

if (extra.length) {
  console.log("");
  console.log("Лишние:");
  for (const x of extra) console.log(x);
}
