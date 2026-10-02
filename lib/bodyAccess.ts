import crypto from "crypto";

export function verifyBodyAccess(
  groupId: string,
  exp: string,
  sig: string
) {
  const secret = process.env.BODY_DIMENSIONS_ACCESS_SECRET;

  if (!secret || !groupId || !exp || !sig) {
    return false;
  }

  const expiresAt = Number(exp);

  if (!Number.isFinite(expiresAt)) {
    return false;
  }

  if (Math.floor(Date.now() / 1000) > expiresAt) {
    return false;
  }

  const payload = `${groupId}.${expiresAt}`;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (!/^[a-f0-9]{64}$/i.test(sig)) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(sig, "hex"),
    Buffer.from(expected, "hex")
  );
}
