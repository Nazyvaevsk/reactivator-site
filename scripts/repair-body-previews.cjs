const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const dryRun = process.argv.includes("--dry-run") || process.argv.includes("--plan");

const BASE = process.env.BODY_BASE || String.raw`D:\Реактиватор\кузовные размеры`;
const META_ROOT = process.env.BODY_META_ROOT || path.join(BASE, "WEB_EXPORT_V2");
const SOURCE_ROOT = process.env.BODY_SOURCE_ROOT || path.join(BASE, "FINAL_REACTIVATOR_CATALOG_V2");
const OUTPUT_ROOT = process.env.BODY_PREVIEW_ROOT || path.join(process.cwd(), "BODY_PREVIEWS_GENERATED");

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
    OUTPUT_ROOT,
    ...parts,
    `sheet_${String(logicalSheet).padStart(3, "0")}.webp`
  );
}

function sourcePathFromAssetKey(assetKey) {
  return path.join(
    SOURCE_ROOT,
    ...assetKey.replace(/\\/g, "/").split("/")
  );
}

function cleanSvg(buffer) {
  let text = buffer.toString("utf8");

  text = text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
    ""
  );

  return Buffer.from(text, "utf8");
}

const jobs = [];

for (const jsonFile of walkJson(META_ROOT)) {
  const group = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  for (const sheet of group.sheets || []) {
    if (!sheet.assetKey) continue;

    const output = previewPathFromAssetKey(
      sheet.assetKey,
      sheet.sheet
    );

    if (!fs.existsSync(output)) {
      jobs.push({
        groupId: group.groupId,
        sheet: sheet.sheet,
        source: sourcePathFromAssetKey(sheet.assetKey),
        output,
      });
    }
  }
}

async function makePreview(job) {
  const original = fs.readFileSync(job.source);
  const cleaned = cleanSvg(original);

  const rendered = await sharp(cleaned)
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
    <svg width="${width}" height="${height}"
      xmlns="http://www.w3.org/2000/svg">
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

  fs.mkdirSync(path.dirname(job.output), {
    recursive: true,
  });

  await sharp(rendered.data)
    .composite([{
      input: watermark,
      top: 0,
      left: 0,
    }])
    .webp({ quality: 72 })
    .toFile(job.output);

  console.log(`OK ${job.groupId} sheet ${job.sheet}`);
  console.log(`   ${job.output}`);
}

(async () => {
  console.log(`Недостающих по assetKey: ${jobs.length}`);
  console.log("");

  if (dryRun) {
    console.log("DRY RUN — превью не создавались; сетевых запросов нет.");
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      await makePreview(job);
      ok++;
    } catch (error) {
      failed++;
      console.error(
        `ERROR ${job.groupId} sheet ${job.sheet}: ${error.message}`
      );
    }
  }

  console.log("");
  console.log("=== ИТОГ ===");
  console.log(`Готово: ${ok}`);
  console.log(`Ошибок: ${failed}`);
  console.log(failed === 0 ? "PASS: YES" : "PASS: NO");

  if (failed) process.exitCode = 1;
})();
