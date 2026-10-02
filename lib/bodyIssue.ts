import "server-only";
import crypto from "node:crypto";

const ISSUE_TTL = 7 * 24 * 60 * 60;
export const ACCESS_TTL = 24 * 60 * 60;

export function bodyIssueConfig() {
  const secret = process.env.BODY_DIMENSIONS_ISSUE_SECRET;
  const accessSecret = process.env.BODY_DIMENSIONS_ACCESS_SECRET;
  const chat = process.env.MASTER_CHAT_ID;
  const base = process.env.BODY_DIMENSIONS_BASE_URL;
  if (!secret || secret.length < 32 || !accessSecret || !chat || !base) {
    throw new Error("Body issue configuration missing");
  }
  const url = new URL(base);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("Body issue origin must be an HTTPS origin");
  }
  return { secret, accessSecret, chat, origin: url.origin };
}

function sign(payload: string) {
  const { secret, chat } = bodyIssueConfig();
  return crypto.createHmac("sha256", secret).update(`body-issue:v1:${chat}:${payload}`).digest("hex");
}

export function createBodyIssueUrl(group: string, now = Math.floor(Date.now() / 1000)) {
  if (!/^[A-Z0-9_-]{1,64}$/.test(group)) throw new Error("Invalid group");
  const payload = `${group}.${now + ISSUE_TTL}.${crypto.randomBytes(16).toString("hex")}`;
  const url = new URL("/body-dimensions/issue", bodyIssueConfig().origin);
  // Fragments never reach HTTP access logs or link-preview requests.
  url.hash = `${payload}.${sign(payload)}`;
  return url.toString();
}

export function verifyBodyIssueToken(token: unknown, now = Math.floor(Date.now() / 1000)) {
  if (typeof token !== "string" || token.length > 256) return null;
  const match = /^([A-Z0-9_-]{1,64})\.([0-9]{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return null;
  const [, group, exp, nonce, sig] = match;
  const expiresAt = Number(exp);
  if (expiresAt <= now || expiresAt > now + ISSUE_TTL) return null;
  const expected = sign(`${group}.${exp}.${nonce}`);
  return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex")) ? group : null;
}

export function createIssuedBodyAccess(group: string, now = Math.floor(Date.now() / 1000)) {
  const { accessSecret, origin } = bodyIssueConfig();
  const expiresAt = now + ACCESS_TTL;
  // Same signing contract as scripts/create-body-access.cjs and lib/bodyAccess.ts.
  const sig = crypto.createHmac("sha256", accessSecret).update(`${group}.${expiresAt}`).digest("hex");
  const url = new URL("/body-dimensions/access", origin);
  url.search = new URLSearchParams({ group, exp: String(expiresAt), sig }).toString();
  return { url: url.toString(), expiresAt };
}
