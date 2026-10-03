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

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

const failedKeys = [
  ...new Set(
    fs.readFileSync(ERROR_LOG, "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .map(line => line.split("|")[1]?.trim())
      .filter(Boolean)
  )
];

const byKey = new Map(manifest.objects.map(x => [x.key, x]));
const upload = process.argv.slice(2).some(arg => arg === "--go" || arg === "--upload");

if (!upload) {
  console.log("=== ПЛАН ПОВТОРА (без сетевых запросов) ===");
  console.log(`Файлов на повтор: ${failedKeys.length}\n`);

  for (const key of failedKeys) {
    const item = byKey.get(key);
    console.log(item ? `К ПОВТОРНОЙ ЗАГРУЗКЕ: ${item.key}` : `НЕТ В МАНИФЕСТЕ: ${key}`);
  }

  console.log("При загрузке объекты с совпадающим размером будут пропущены.");
  console.log("Для реальной повторной загрузки укажите --go или --upload.");
  process.exit(0);
}

loadEnvConfig(process.cwd());

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_UPLOAD_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_UPLOAD_SECRET_ACCESS_KEY,
  },
  maxAttempts: 8,
});

const bucket = process.env.R2_BUCKET_NAME;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function sameSize(item) {
  try {
    const r = await client.send(new HeadObjectCommand({
      Bucket: bucket,
      Key: item.key,
    }));
    return Number(r.ContentLength) === Number(item.size);
  } catch (e) {
    if (e?.$metadata?.httpStatusCode === 404 || e?.name === "NotFound") {
      return false;
    }
    throw e;
  }
}

async function retryItem(item) {
  if (await sameSize(item)) {
    console.log(`УЖЕ ЕСТЬ: ${item.key}`);
    return true;
  }

  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      console.log(`ЗАГРУЗКА ${attempt}/8: ${item.key}`);

      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: item.key,
        Body: fs.createReadStream(item.localPath),
        ContentLength: item.size,
        ContentType: "image/svg+xml",
      }));

      if (!(await sameSize(item))) {
        throw new Error("Размер после загрузки не совпал");
      }

      console.log(`OK: ${item.key}`);
      return true;
    } catch (e) {
      console.log(`СБОЙ: ${e.name}: ${e.message}`);

      if (attempt < 8) {
        await sleep(attempt * 3000);
      }
    }
  }

  return false;
}

(async () => {
  console.log(`Файлов на повтор: ${failedKeys.length}\n`);

  let ok = 0;
  let fail = 0;

  for (const key of failedKeys) {
    const item = byKey.get(key);

    if (!item) {
      console.log(`НЕТ В МАНИФЕСТЕ: ${key}`);
      fail++;
      continue;
    }

    if (await retryItem(item)) ok++;
    else fail++;

    console.log("");
  }

  console.log("=== ИТОГ ПОВТОРА ===");
  console.log(`OK: ${ok}`);
  console.log(`Ошибок: ${fail}`);
  console.log(fail === 0 ? "PASS: YES" : "PASS: NO");

  if (fail) process.exitCode = 1;
})();
