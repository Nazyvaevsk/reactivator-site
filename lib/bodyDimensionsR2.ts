import "server-only";
import { GetObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";

let client: S3Client | undefined;

function getClient() {
  if (client) return client;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !/^[a-f0-9]{32}$/i.test(accountId) || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 server configuration is missing or invalid");
  }
  client = new S3Client({
    region: "auto",
    endpoint: "https://" + accountId + ".r2.cloudflarestorage.com",
    credentials: { accessKeyId, secretAccessKey },
    maxAttempts: 2,
  });
  return client;
}

// No public URLs or local-original fallback. Call only after access verification.
export async function readR2Sheet(key: string): Promise<Uint8Array | null> {
  try {
    const result = await getClient().send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "reactivator-body-dimensions",
      Key: key,
    }), { abortSignal: AbortSignal.timeout(15_000) });
    if (!result.Body) throw new Error("R2 returned an empty response body");
    return await result.Body.transformToByteArray();
  } catch (error) {
    if (error instanceof S3ServiceException && error.name === "NoSuchKey") return null;
    // Do not propagate SDK diagnostics, credentials or signed requests to clients/logs.
    throw new Error("Body dimensions storage is unavailable");
  }
}
