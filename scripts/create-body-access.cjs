const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error("Не найден .env.local");
  }

  const text = fs.readFileSync(envPath, "utf8");

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const groupId = (process.argv[2] || "").trim().toUpperCase();

if (!groupId) {
  console.error("Использование:");
  console.error("node .\\scripts\\create-body-access.cjs S04435");
  process.exit(1);
}

if (!/^[A-Z0-9_-]+$/.test(groupId)) {
  console.error("Некорректный groupId");
  process.exit(1);
}

const secret = process.env.BODY_DIMENSIONS_ACCESS_SECRET;

if (!secret) {
  console.error("BODY_DIMENSIONS_ACCESS_SECRET не найден");
  process.exit(1);
}

const privateRoot = path.resolve(
  process.cwd(),
  "private",
  "body-dimensions"
);

const accessIndexPath = path.join(
  privateRoot,
  "access-index.json"
);

if (!fs.existsSync(accessIndexPath)) {
  console.error("Не найден private\\body-dimensions\\access-index.json");
  process.exit(1);
}

const accessIndex = JSON.parse(
  fs.readFileSync(accessIndexPath, "utf8")
);

const group = accessIndex.groups[groupId];

if (!group) {
  console.error(`Комплект ${groupId} не найден в каталоге`);
  process.exit(1);
}

const missing = [];

for (const sheet of group.sheets) {
  const relativeAsset = sheet.assetKey.replace(/^groups[\\/]/i, "");

  const filePath = path.resolve(
    privateRoot,
    relativeAsset
  );

  if (
    !filePath.startsWith(privateRoot + path.sep) ||
    !fs.existsSync(filePath)
  ) {
    missing.push(path.basename(sheet.assetKey));
  }
}

if (missing.length > 0) {
  console.error(`Комплект ${groupId} пока не готов к выдаче.`);
  console.error(`Нет оригиналов: ${missing.join(", ")}`);
  process.exit(1);
}

const expiresAt =
  Math.floor(Date.now() / 1000) + 24 * 60 * 60;

const payload = `${groupId}.${expiresAt}`;

const signature = crypto
  .createHmac("sha256", secret)
  .update(payload)
  .digest("hex");

const baseUrl =
  process.env.BODY_DIMENSIONS_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://reactivator55.ru";

const url = new URL(
  "/body-dimensions/access",
  baseUrl
);

url.searchParams.set("group", groupId);
url.searchParams.set("exp", String(expiresAt));
url.searchParams.set("sig", signature);

console.log("");
console.log(`${group.make} ${group.model} ${group.year}`);
console.log(`Комплект: ${group.groupId}`);
console.log(`Вариант: ${group.variant || "—"}`);
console.log(`Листов: ${group.sheetCount}`);
console.log("Срок доступа: 24 часа");
console.log(
  `Истекает: ${new Date(expiresAt * 1000).toLocaleString("ru-RU")}`
);
console.log("");
console.log(url.toString());
console.log("");
