const fs = require("fs");
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const MANIFEST = path.join(process.cwd(), "BODY_R2_UPLOAD_MANIFEST.json");
const ERROR_LOG = path.join(process.cwd(), "BODY_R2_UPLOAD_ERRORS.log");

const args = process.argv.slice(2);

const isGo = args.includes("--go") && !args.includes("--dry-run") && !args.includes("--plan");
if (isGo) loadEnvConfig(process.cwd());
const isDryRun = !isGo;

function getArg(prefix, fallback) {
  const arg = args.find((x) => x.startsWith(prefix + "="));
  if (!arg) return fallback;
  return arg.slice(prefix.length + 1);
}

const concurrency = Math.max(
  1,
  Math.min(16, Number(getArg("--concurrency", "6")) || 6)
);

const limitArg = Number(getArg("--limit", "0")) || 0;

const required = [
  "R2_ACCOUNT_ID",
  "R2_UPLOAD_ACCESS_KEY_ID",
  "R2_UPLOAD_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

for (const key of isGo ? required : []) {
  if (!process.env[key]) {
    console.error(`НЕТ ПЕРЕМЕННОЙ: ${key}`);
    process.exit(1);
  }
}

if (!fs.existsSync(MANIFEST)) {
  console.error(`Не найден манифест: ${MANIFEST}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

let objects = manifest.objects || [];

if (limitArg > 0) {
  objects = objects.slice(0, limitArg);
}

const client = isGo ? new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_UPLOAD_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_UPLOAD_SECRET_ACCESS_KEY,
  },
  maxAttempts: 5,
}) : null;

const bucket = process.env.R2_BUCKET_NAME;

let nextIndex = 0;
let processed = 0;
let uploaded = 0;
let skipped = 0;
let failed = 0;

let uploadedBytes = 0;
let skippedBytes = 0;

const startedAt = Date.now();

function humanBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function printProgress(force = false) {
  if (!force && processed % 25 !== 0) return;

  const elapsedSec = Math.max(1, (Date.now() - startedAt) / 1000);
  const rate = processed / elapsedSec;

  const remaining = objects.length - processed;
  const etaSec = rate > 0 ? remaining / rate : 0;

  console.log(
    `[${processed}/${objects.length}] ` +
    `uploaded=${uploaded} ` +
    `skip=${skipped} ` +
    `errors=${failed} ` +
    `upload=${humanBytes(uploadedBytes)} ` +
    `ETA≈${Math.ceil(etaSec / 60)} мин`
  );
}

async function remoteHasSameSize(item) {
  try {
    const result = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: item.key,
      })
    );

    return Number(result.ContentLength) === Number(item.size);
  } catch (error) {
    const code =
      error?.$metadata?.httpStatusCode ||
      error?.statusCode ||
      error?.name;

    if (
      code === 404 ||
      error?.name === "NotFound" ||
      error?.name === "NoSuchKey"
    ) {
      return false;
    }

    throw error;
  }
}

async function uploadObject(item) {
  if (!fs.existsSync(item.localPath)) {
    throw new Error(`LOCAL FILE NOT FOUND: ${item.localPath}`);
  }

  const localSize = fs.statSync(item.localPath).size;

  if (localSize !== item.size) {
    throw new Error(
      `SIZE CHANGED: manifest=${item.size}, disk=${localSize}, ${item.localPath}`
    );
  }

  if (await remoteHasSameSize(item)) {
    skipped++;
    skippedBytes += item.size;
    return;
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: item.key,
      Body: fs.createReadStream(item.localPath),
      ContentLength: item.size,
      ContentType: "image/svg+xml",
    })
  );

  const verified = await remoteHasSameSize(item);

  if (!verified) {
    throw new Error(`VERIFY FAILED AFTER UPLOAD: ${item.key}`);
  }

  uploaded++;
  uploadedBytes += item.size;
}

async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= objects.length) return;

    const item = objects[index];

    try {
      await uploadObject(item);
    } catch (error) {
      failed++;

      const line =
        `${new Date().toISOString()} | ${item.key} | ` +
        `${error?.name || "Error"} | ${error?.message || error}\r\n`;

      fs.appendFileSync(ERROR_LOG, line, "utf8");

      console.error(`ERROR: ${item.key}`);
      console.error(error?.message || error);
    } finally {
      processed++;
      printProgress();
    }
  }
}

async function main() {
  const totalBytes = objects.reduce((sum, x) => sum + Number(x.size || 0), 0);

  console.log("");
  if (isGo) console.log(`Bucket: ${bucket}`);
  console.log(`Объектов в запуске: ${objects.length}`);
  console.log(`Объём: ${humanBytes(totalBytes)}`);
  console.log(`Параллельных потоков: ${concurrency}`);

  if (isDryRun) {
    console.log("");
    console.log("DRY RUN — ничего не загружается.");
    console.log("");
    console.log("Первые 5 объектов:");

    for (const item of objects.slice(0, 5)) {
      console.log(`${item.key} <- ${item.localPath}`);
    }

    console.log("");
    console.log("PASS: READY TO UPLOAD");
    return;
  }

  if (fs.existsSync(ERROR_LOG)) {
    fs.unlinkSync(ERROR_LOG);
  }

  console.log("");
  console.log("Начинаю загрузку...");
  console.log("");

  await Promise.all(
    Array.from({ length: concurrency }, () => worker())
  );

  printProgress(true);

  console.log("");
  console.log("=== ИТОГ ===");
  console.log(`Обработано: ${processed}`);
  console.log(`Загружено: ${uploaded}`);
  console.log(`Уже было в R2: ${skipped}`);
  console.log(`Ошибок: ${failed}`);
  console.log(`Загружено данных: ${humanBytes(uploadedBytes)}`);
  console.log(`Пропущено данных: ${humanBytes(skippedBytes)}`);

  if (failed === 0 && processed === objects.length) {
    console.log("");
    console.log("PASS: YES");
  } else {
    console.log("");
    console.log("PASS: NO");
    console.log(`Лог ошибок: ${ERROR_LOG}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("");
  console.error("FATAL:");
  console.error(error);
  process.exit(1);
});
