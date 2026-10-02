# Private body dimensions in R2

The access page and both APIs keep the existing HMAC link format. The generator
still issues links for 24 hours. Each API verifies the signature before reading R2.
Original bytes are proxied by the server; download assembles the same flat SVG ZIP.
There is no public R2 URL, browser credential, or local SVG fallback.

## Cloudflare

Create the bucket reactivator-body-dimensions.
Keep Public Development URL (r2.dev) disabled and do not connect a public custom domain.
Use the default jurisdiction for the account endpoint implemented here.
Create an R2 API token with Object Read only, scoped only to this bucket.
Store its Access Key ID and Secret Access Key securely in server environment settings.
For uploads use the dashboard, or a separate Object Read & Write token scoped to this bucket.
Do not give the application's token upload or administration permissions.

## Server environment

- R2_ACCOUNT_ID: Cloudflare account ID.
- R2_ACCESS_KEY_ID: read-only R2 S3 Access Key ID.
- R2_SECRET_ACCESS_KEY: corresponding Secret Access Key.
- R2_BUCKET_NAME: reactivator-body-dimensions (also the code default).
- BODY_DIMENSIONS_ACCESS_SECRET: keep the existing HMAC secret, identical to the local generator.

No NEXT_PUBLIC_ prefix. Use local .env.local and Vercel environment settings;
do not commit secrets. Configure Preview/Production separately as appropriate.
BODY_DIMENSIONS_BASE_URL remains a local link-generator setting for the target site URL.
R2 credentials are read lazily at request time; builds do not need them.

## Object keys

Upload the three test originals using these exact case-sensitive keys:

- groups/ACURA/RSX/2009/S04435/sheet_002.svg
- groups/ACURA/RSX/2009/S04435/sheet_003.svg
- groups/ACURA/RSX/2009/S04435/sheet_004.svg

Local originals are under private/body-dimensions/ACURA/RSX/2009/S04435/.
The groups/ prefix is part of each R2 key. Other keys follow assetKey in access-index.json.

## Metadata and build

npm run build regenerates private/body-dimensions/access-index.json from the existing
public JSON catalog via prebuild. It contains descriptions and object keys, no SVG bytes.
The index stays Git-ignored and is explicitly included in the three server traces.
Private SVGs are explicitly excluded from server traces. The old .vercelignore is removed.
Use the normal Git-based Vercel build (npm run build); no private-original upload is needed.
For local development before a build, run node scripts/build-body-access-index.cjs once.
The generator checks metadata only: upload and verify R2 objects before giving a link to a customer.

## Verification after credentials and uploads

Generate a link with node scripts/create-body-access.cjs S04435.
Verify the access page, all three sheets, and ZIP against original bytes.
Missing/invalid/expired signatures must return 403, unknown sheets 404,
and unavailable/misconfigured R2 503 with no SDK diagnostics.
Direct private SVG and index URLs must return 404. Successful SVG/ZIP responses use private, no-store.
No bucket configuration, upload, deployment, commit or push is performed by this integration.

References: https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
and https://developers.cloudflare.com/r2/api/tokens/
