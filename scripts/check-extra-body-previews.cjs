const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BASE = process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`;
const META_ROOT = process.env.BODY_META_ROOT || path.join(BASE, "WEB_EXPORT_V2");
const PREVIEW_ROOT = process.env.BODY_PREVIEW_ROOT || path.join(process.cwd(), "BODY_PREVIEWS_GENERATED");

const args = process.argv.slice(2);
const doDelete = args.includes("--delete") && !args.includes("--dry-run") && !args.includes("--plan");

function walk(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      walk(full, filter, out);
    } else if (!filter || filter(full)) {
      out.push(full);
    }
  }

  return out;
}

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

function expectedRel(assetKey, logicalSheet) {
  const parts = assetKey.replace(/\\/g, "/").split("/");

  if (parts[0].toLowerCase() === "groups") {
    parts.shift();
  }

  parts.pop();

  return path.join(
    ...parts,
    `sheet_${String(logicalSheet).padStart(3, "0")}.webp`
  );
}

function sha256(file) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
}

const expected = new Map();
const byGroupSheet = new Map();

for (const jsonFile of walkJson(META_ROOT)) {
  const group = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  for (const sheet of group.sheets || []) {
    if (!sheet.assetKey) continue;

    const rel = expectedRel(sheet.assetKey, sheet.sheet);
    const key = rel.toLowerCase();

    expected.set(key, rel);

    byGroupSheet.set(
      `${String(group.groupId).toLowerCase()}|sheet_${String(sheet.sheet).padStart(3, "0")}.webp`,
      rel
    );
  }
}

const actualFiles = walk(
  PREVIEW_ROOT,
  f => f.toLowerCase().endsWith(".webp")
);

const extras = actualFiles.filter(file => {
  const rel = path.relative(PREVIEW_ROOT, file).toLowerCase();
  return !expected.has(rel);
});

let exact = 0;
let different = 0;
let noTarget = 0;
let deleted = 0;

for (const extra of extras) {
  const rel = path.relative(PREVIEW_ROOT, extra);
  const parts = rel.split(path.sep);

  const groupId = parts.find(x => /^s\d+$/i.test(x));
  const sheetFile = path.basename(extra).toLowerCase();

  if (!groupId) {
    console.log(`NO GROUP ID: ${rel}`);
    noTarget++;
    continue;
  }

  const canonicalRel = byGroupSheet.get(
    `${groupId.toLowerCase()}|${sheetFile}`
  );

  if (!canonicalRel) {
    console.log(`NO TARGET: ${rel}`);
    noTarget++;
    continue;
  }

  const canonical = path.join(PREVIEW_ROOT, canonicalRel);

  if (!fs.existsSync(canonical)) {
    console.log(`TARGET MISSING: ${rel} -> ${canonicalRel}`);
    noTarget++;
    continue;
  }

  const same = sha256(extra) === sha256(canonical);

  if (same) {
    exact++;

    if (doDelete) {
      fs.unlinkSync(extra);
      deleted++;
    }
  } else {
    different++;
    console.log(`DIFFERENT:`);
    console.log(`  extra: ${rel}`);
    console.log(`  good : ${canonicalRel}`);
  }
}

console.log("");
console.log("=== ИТОГ ===");
console.log(`Лишних найдено: ${extras.length}`);
console.log(`Точных дублей: ${exact}`);
console.log(`Отличаются: ${different}`);
console.log(`Без пары: ${noTarget}`);

if (doDelete) {
  console.log(`Удалено: ${deleted}`);
} else {
  console.log("Ничего не удалялось — режим проверки.");
}

if (
  exact === extras.length &&
  different === 0 &&
  noTarget === 0
) {
  console.log("");
  console.log(extras.length === 0 ? "PASS: NO EXTRAS" : "PASS: SAFE TO DELETE");
} else {
  console.log("");
  console.log("PASS: NEED REVIEW");
}
