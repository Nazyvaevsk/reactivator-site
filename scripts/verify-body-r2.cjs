const fs = require("fs");
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const {
  S3Client,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const MANIFEST = path.join(process.cwd(), "BODY_R2_UPLOAD_MANIFEST.json");
const OUT = path.join(process.cwd(), "BODY_R2_VERIFY_REPORT.txt");

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const objects = manifest.objects || [];

if (process.argv.includes("--plan") || process.argv.includes("--dry-run")) {
  console.log(`План проверки: ${objects.length} объектов из манифеста.`);
  console.log("R2 не проверялся; сетевых запросов и записи отчёта нет.");
  process.exit(0);
}

loadEnvConfig(process.cwd());

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  maxAttempts: 6,
});

const bucket = process.env.R2_BUCKET_NAME;

let nextIndex = 0;
let checked = 0;
let ok = 0;
let missing = 0;
let wrongSize = 0;
let errors = 0;

const problems = [];
const concurrency = 8;

async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= objects.length) return;

    const item = objects[index];

    try {
      const r = await client.send(new HeadObjectCommand({
        Bucket: bucket,
        Key: item.key,
      }));

      if (Number(r.ContentLength) === Number(item.size)) {
        ok++;
      } else {
        wrongSize++;
        problems.push(
          `SIZE | ${item.key} | local=${item.size} | r2=${r.ContentLength}`
        );
      }
    } catch (e) {
      const status = e?.$metadata?.httpStatusCode;

      if (status === 404 || e?.name === "NotFound" || e?.name === "NoSuchKey") {
        missing++;
        problems.push(`MISSING | ${item.key}`);
      } else {
        errors++;
        problems.push(
          `ERROR | ${item.key} | ${e?.name || "Error"} | ${e?.message || e}`
        );
      }
    } finally {
      checked++;

      if (checked % 100 === 0 || checked === objects.length) {
        console.log(
          `[${checked}/${objects.length}] ok=${ok} missing=${missing} wrongSize=${wrongSize} errors=${errors}`
        );
      }
    }
  }
}

(async () => {
  console.log(`Проверяю ${objects.length} объектов в R2...`);

  await Promise.all(
    Array.from({ length: concurrency }, () => worker())
  );

  const lines = [
    `Проверено: ${checked}`,
    `OK: ${ok}`,
    `Missing: ${missing}`,
    `Wrong size: ${wrongSize}`,
    `Errors: ${errors}`,
    "",
    ...problems,
  ];

  fs.writeFileSync(OUT, lines.join("\r\n"), "utf8");

  console.log("");
  console.log("=== ИТОГ ПРОВЕРКИ ===");
  console.log(`Проверено: ${checked}`);
  console.log(`OK: ${ok}`);
  console.log(`Отсутствуют: ${missing}`);
  console.log(`Размер не совпал: ${wrongSize}`);
  console.log(`Ошибок: ${errors}`);

  if (
    checked === objects.length &&
    ok === objects.length &&
    missing === 0 &&
    wrongSize === 0 &&
    errors === 0
  ) {
    console.log("");
    console.log("PASS: YES");
  } else {
    console.log("");
    console.log("PASS: NO");
    console.log(`Отчёт: ${OUT}`);
    process.exitCode = 1;
  }
})();
