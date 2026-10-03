const fs = require("fs");
const path = require("path");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const ROOT = process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`;
const OUT = path.join(process.cwd(), "BODY_SVG_LOCATION_INSPECTION.txt");

let count = 0;
const samples = [];
const byTopFolder = new Map();

function walk(dir) {
  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".svg")) continue;

    count++;

    const rel = path.relative(ROOT, full);
    const top = rel.split(path.sep)[0] || "(root)";

    byTopFolder.set(top, (byTopFolder.get(top) || 0) + 1);

    if (samples.length < 100) {
      samples.push({
        rel,
        size: fs.statSync(full).size,
      });
    }
  }
}

console.log("Ищу SVG во всём архиве...");
walk(ROOT);

const lines = [];

lines.push(`ROOT: ${ROOT}`);
lines.push(`SVG найдено: ${count}`);
lines.push("");

lines.push("=== ПО ВЕРХНИМ ПАПКАМ ===");

for (const [name, qty] of [...byTopFolder.entries()].sort((a,b) => b[1] - a[1])) {
  lines.push(`${name}: ${qty}`);
}

lines.push("");
lines.push("=== ПЕРВЫЕ 100 SVG ===");

for (const item of samples) {
  lines.push(`${item.rel} | ${item.size} bytes`);
}

if (!dryRun) fs.writeFileSync(OUT, lines.join("\r\n"), "utf8");

console.log("");
console.log(`SVG найдено: ${count}`);
console.log("");
console.log("По верхним папкам:");

for (const [name, qty] of [...byTopFolder.entries()].sort((a,b) => b[1] - a[1]).slice(0,20)) {
  console.log(`${name}: ${qty}`);
}

console.log("");
console.log(dryRun ? "DRY RUN — файлы не записывались." : `Отчёт: ${OUT}`);
