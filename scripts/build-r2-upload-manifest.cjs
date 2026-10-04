const fs = require("fs");
const path = require("path");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const BASE = process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`;
const META_ROOT = process.env.BODY_META_ROOT || path.join(BASE, "WEB_EXPORT_V2");
const SOURCE_ROOT = process.env.BODY_SOURCE_ROOT || path.join(BASE, "FINAL_REACTIVATOR_CATALOG_V2");

const OUT = path.join(process.cwd(), "BODY_R2_UPLOAD_MANIFEST.json");

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

console.log("Собираю манифест R2...");

const jsonFiles = walkJson(META_ROOT);

const objects = [];
const keys = new Set();

let totalBytes = 0;
let missing = 0;
let duplicateKeys = 0;

for (const jsonFile of jsonFiles) {
  const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  for (const sheet of data.sheets || []) {
    if (!sheet.assetKey) continue;

    const key = sheet.assetKey.replace(/\\/g, "/");

    if (keys.has(key)) {
      duplicateKeys++;
      continue;
    }

    keys.add(key);

    const localPath = path.join(
      SOURCE_ROOT,
      // R2 retains its physical key; the local brand folder uses the corrected name.
      ...key.replace(/^groups\/CHANG AN\//, "groups/CHANGAN/").split("/")
    );

    if (!fs.existsSync(localPath)) {
      missing++;
      continue;
    }

    const stat = fs.statSync(localPath);

    objects.push({
      key,
      localPath,
      size: stat.size,
      groupId: data.groupId || null,
      make: data.make || null,
      model: data.model || null,
      year: data.year || null,
      variant: data.variant || null,
    });

    totalBytes += stat.size;
  }
}

objects.sort((a, b) => a.key.localeCompare(b.key));

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceRoot: SOURCE_ROOT,
  objectCount: objects.length,
  totalBytes,
  objects,
};

if (!dryRun) fs.writeFileSync(
  OUT,
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log("");
console.log(`Ожидаемых уникальных assetKey: ${keys.size}`);
console.log(`Объектов: ${objects.length}`);
console.log(`Пропущено из-за отсутствия файла: ${missing}`);
console.log(`Дубли assetKey: ${duplicateKeys}`);
console.log(`Общий объём: ${(totalBytes / 1024 / 1024 / 1024).toFixed(3)} GB`);
console.log("");
console.log(dryRun ? "DRY RUN — файлы не записывались." : `Манифест: ${OUT}`);

if (
  keys.size > 0 &&
  objects.length === keys.size &&
  missing === 0 &&
  duplicateKeys === 0
) {
  console.log("");
  console.log("PASS: YES");
} else {
  console.log("");
  console.log("PASS: NO");
  process.exitCode = 1;
}
