const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("--plan");

const BASE = getArg("--base", process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`);
const META_ROOT = getArg("--metadata", process.env.BODY_META_ROOT || path.join(BASE, "WEB_EXPORT_V2"));
const SOURCE_ROOT = getArg("--source", process.env.BODY_SOURCE_ROOT || path.join(BASE, "FINAL_REACTIVATOR_CATALOG_V2"));

const OUTPUT_ROOT = getArg("--output", process.env.BODY_PREVIEW_ROOT || path.join(process.cwd(), "BODY_PREVIEWS_GENERATED"));

function getArg(name, fallback) {
  const item = args.find(x => x.startsWith(name + "="));
  return item ? item.slice(name.length + 1) : fallback;
}

const limit = Number(getArg("--limit", "0")) || 0;
const concurrency = Math.max(
  1,
  Math.min(8, Number(getArg("--concurrency", "4")) || 4)
);

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

const jobs = [];

for (const jsonFile of walkJson(META_ROOT)) {
  const group = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  for (const sheet of group.sheets || []) {
    if (!sheet.assetKey) continue;

    const source = path.join(
      SOURCE_ROOT,
      ...sheet.assetKey.replace(/\\/g, "/").split("/")
    );

    const logicalNumber = String(sheet.sheet).padStart(3, "0");
    const parts = sheet.assetKey.replace(/\\/g, "/").split("/");

    if (parts[0].toLowerCase() === "groups") {
      parts.shift();
    }

    parts.pop();

    const output = path.join(
      OUTPUT_ROOT,
      ...parts,
      `sheet_${logicalNumber}.webp`
    );

    jobs.push({
      source,
      output,
      label: `${group.groupId} sheet ${sheet.sheet}`,
    });
  }
}

const selected = limit > 0 ? jobs.slice(0, limit) : jobs;

let next = 0;
let done = 0;
let created = 0;
let skipped = 0;
let failed = 0;
let totalBytes = 0;

async function makePreview(job) {
  if (!fs.existsSync(job.source)) {
    throw new Error(`SOURCE NOT FOUND: ${job.source}`);
  }

  if (fs.existsSync(job.output)) {
    const stat = fs.statSync(job.output);

    if (stat.size > 0) {
      skipped++;
      totalBytes += stat.size;
      return;
    }
  }

  fs.mkdirSync(path.dirname(job.output), { recursive: true });

  const rendered = await sharp(job.source)
    .resize({
      width: 900,
      withoutEnlargement: true,
    })
    .flatten({ background: "#ffffff" })
    .blur(1.5)
    .png()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = rendered.info;

  const fontSize = Math.max(
    32,
    Math.round(width / 14)
  );

  const watermark = Buffer.from(`
    <svg
      width="${width}"
      height="${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="translate(${width / 2} ${height / 2}) rotate(-22)"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-weight="700"
        font-size="${fontSize}"
        fill="#ff6900"
        opacity="0.11"
      >
        <text y="-40">REACTIVATOR · PREVIEW</text>
        <text y="80">REACTIVATOR · PREVIEW</text>
      </g>
    </svg>
  `);

  await sharp(rendered.data)
    .composite([{
      input: watermark,
      top: 0,
      left: 0,
    }])
    .webp({ quality: 72 })
    .toFile(job.output);

  const stat = fs.statSync(job.output);

  created++;
  totalBytes += stat.size;
}

async function worker() {
  while (true) {
    const index = next++;
    if (index >= selected.length) return;

    const job = selected[index];

    try {
      await makePreview(job);
    } catch (error) {
      failed++;
      console.error(`ERROR ${job.label}: ${error.message}`);
    } finally {
      done++;

      if (done % 10 === 0 || done === selected.length) {
        console.log(
          `[${done}/${selected.length}] created=${created} skipped=${skipped} errors=${failed}`
        );
      }
    }
  }
}

(async () => {
  console.log(`Всего листов каталога: ${jobs.length}`);
  console.log(`В этом запуске: ${selected.length}`);
  console.log(`Потоков: ${concurrency}`);
  console.log(`Выход: ${OUTPUT_ROOT}`);
  console.log("");

  if (dryRun) {
    console.log("DRY RUN — превью не создавались; сетевых запросов нет.");
    return;
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker())
  );

  console.log("");
  console.log("=== ИТОГ ===");
  console.log(`Обработано: ${done}`);
  console.log(`Создано: ${created}`);
  console.log(`Уже было: ${skipped}`);
  console.log(`Ошибок: ${failed}`);
  console.log(`Размер превью: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log("");

  if (done === selected.length && failed === 0) {
    console.log("PASS: YES");
  } else {
    console.log("PASS: NO");
    process.exitCode = 1;
  }
})();
