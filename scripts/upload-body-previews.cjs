'use strict';
// Standalone: resolves dependencies and reads ONLY preview credentials from the project.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { parseEnv } = require('node:util');
const { createHash } = require('node:crypto');
const BUCKET = 'reactivator-body-previews';

function fail(code) { const e = new Error(code); e.safeCode = code; throw e; }
function safeError(e) {
  if (e.safeCode) return e.safeCode;
  const status = Number(e?.$metadata?.httpStatusCode);
  if (status) {
    const names = new Set(['AccessDenied','InvalidAccessKeyId','SignatureDoesNotMatch','Unauthorized','NoSuchBucket','NotFound','NoSuchKey']);
    return `HTTP_${status}${names.has(e?.name) ? '_' + e.name : ''}`;
  }
  const codes = new Set(['EPERM','EACCES','ENOTFOUND','ECONNREFUSED','ECONNRESET','ETIMEDOUT','ENOENT','EAI_AGAIN','ERR_TLS_CERT_ALTNAME_INVALID']);
  if (codes.has(e?.code)) return e.code;
  if (codes.has(e?.cause?.code)) return e.cause.code;
  return 'LOCAL_OR_NETWORK_ERROR';
}
function walk(dir, extension, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) fail('SYMLINK_NOT_ALLOWED');
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, extension, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) out.push(file);
  }
  return out;
}
function scan(project, meta) {
  const root = process.env.BODY_PREVIEW_ROOT || path.join(project, 'BODY_PREVIEWS_GENERATED');
  if (fs.lstatSync(root).isSymbolicLink()) fail('SYMLINK_NOT_ALLOWED');
  const expected = new Set();
  for (const file of walk(meta, '.json')) {
    const group = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const sheet of group.sheets || []) {
      if (!sheet.assetKey) continue;
      const parts = sheet.assetKey.replace(/\\/g, '/').split('/');
      if (parts[0].toLowerCase() === 'groups') parts.shift();
      parts.pop();
      if (!Number.isInteger(Number(sheet.sheet)) || Number(sheet.sheet) < 1) fail('INVALID_SHEET');
      parts.push(`sheet_${String(sheet.sheet).padStart(3, '0')}.webp`);
      if (parts.some(p => !p || p === '.' || p === '..')) fail('INVALID_ASSET_PATH');
      expected.add(parts.join('/').toLowerCase());
    }
  }
  const items = walk(root, '.webp').map(file => {
    const key = path.relative(root, file).split(path.sep).join('/').toLowerCase();
    const stat = fs.statSync(file);
    const fd = fs.openSync(file, 'r');
    const header = Buffer.alloc(12);
    try { fs.readSync(fd, header, 0, 12, 0); } finally { fs.closeSync(fd); }
    if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') fail('INVALID_WEBP');
    return { key, file, size: stat.size, mtimeMs: stat.mtimeMs };
  }).sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  const actual = new Set(items.map(i => i.key));
  if (expected.size === 0 || items.length !== expected.size || actual.size !== expected.size ||
      [...expected].some(key => !actual.has(key))) fail('LOCAL_CATALOG_MISMATCH');
  return items;
}
function digest(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
async function main() {
  const args = process.argv.slice(2);
  const modes = args.filter(a => ['--plan', '--test', '--upload', '--verify'].includes(a));
  if (modes.length > 1 || args.some(a => !['--plan','--test','--upload','--verify','--go'].includes(a) &&
      !/^--(project|metadata|concurrency)=.+$/.test(a))) fail('INVALID_ARGUMENTS');
  const option = (name, fallback) => args.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
  const project = path.resolve(option('project', process.cwd()));
  const meta = path.resolve(option('metadata', process.env.BODY_META_ROOT || path.join(process.env.BODY_BASE || path.join(project, '..', 'кузовные размеры'), 'WEB_EXPORT_V2')));
  const mode = modes[0] || '--plan';
  if (mode === '--test' && !args.includes('--go')) fail('TEST_UPLOAD_REQUIRES_GO');
  const concurrency = Number(option('concurrency', '6'));
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) fail('INVALID_CONCURRENCY');
  const items = scan(project, meta);
  console.log(`Local catalog: ${items.length}; bytes=${items.reduce((s,i)=>s+i.size,0)}; bucket=${BUCKET}`);
  if (mode === '--plan') { console.log('PASS: local catalog; no network requests or uploads.'); return; }
  const env = parseEnv(fs.readFileSync(path.join(project, '.env.local'), 'utf8'));
  for (const name of ['R2_ACCOUNT_ID','R2_PREVIEW_UPLOAD_ACCESS_KEY_ID','R2_PREVIEW_UPLOAD_SECRET_ACCESS_KEY','R2_PREVIEW_BUCKET_NAME']) {
    if (!env[name]?.trim()) fail(`MISSING_${name}`);
  }
  if (env.R2_PREVIEW_BUCKET_NAME !== BUCKET) fail('PREVIEW_BUCKET_MISMATCH');
  if (!/^[a-f0-9]{32}$/i.test(env.R2_ACCOUNT_ID)) fail('INVALID_ACCOUNT_ID');
  const req = createRequire(path.join(project, 'package.json'));
  const { S3Client, HeadObjectCommand, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = req('@aws-sdk/client-s3');
  const client = new S3Client({ region: 'auto', endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: env.R2_PREVIEW_UPLOAD_ACCESS_KEY_ID, secretAccessKey: env.R2_PREVIEW_UPLOAD_SECRET_ACCESS_KEY },
    maxAttempts: 5, requestHandler: { connectionTimeout: 15000, requestTimeout: 60000, throwOnRequestTimeout: true } });
  const abort = new AbortController();
  const onInterrupt = () => abort.abort();
  process.once('SIGINT', onInterrupt);
  const send = command => client.send(command, { abortSignal: abort.signal });
  const report = { mode, bucket: BUCKET, started: new Date().toISOString(), expected: items.length, uploaded: 0, skipped: 0, failures: [] };
  const reportDir = path.join(__dirname, 'preview-upload-reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const reportFile = path.join(reportDir, `${Date.now()}-${mode.slice(2)}.json`);
  const save = () => { fs.writeFileSync(reportFile + '.tmp', JSON.stringify(report, null, 2)); fs.renameSync(reportFile + '.tmp', reportFile); };
  async function head(item) {
    try { return await send(new HeadObjectCommand({ Bucket: BUCKET, Key: item.key })); }
    catch (e) { if (e?.$metadata?.httpStatusCode === 404) return null; throw e; }
  }
  async function upload(item) {
    const stat = fs.statSync(item.file);
    if (stat.size !== item.size || stat.mtimeMs !== item.mtimeMs) fail('LOCAL_FILE_CHANGED');
    const existing = await head(item);
    if (existing && Number(existing.ContentLength) === item.size) { report.skipped++; return; }
    const body = fs.readFileSync(item.file);
    if (body.length !== item.size) fail('LOCAL_FILE_CHANGED');
    // Buffer bodies can be replayed safely by SDK retries.
    await send(new PutObjectCommand({ Bucket: BUCKET, Key: item.key, Body: body,
      ContentLength: body.length, ContentType: 'image/webp', Metadata: { sha256: digest(body) } }));
    const checked = await head(item);
    if (!checked || Number(checked.ContentLength) !== item.size || checked.ContentType !== 'image/webp') fail('POST_UPLOAD_CHECK_FAILED');
    report.uploaded++;
  }
  async function verifyAll() {
    const remote = new Map();
    let token;
    do {
      const page = await send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 1000, ContinuationToken: token }));
      for (const object of page.Contents || []) remote.set(object.Key, Number(object.Size));
      if (page.IsTruncated && (!page.NextContinuationToken || page.NextContinuationToken === token)) fail('INVALID_PAGINATION');
      token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
    const keys = new Set(items.map(i => i.key));
    const missing = items.filter(i => !remote.has(i.key)).map(i => i.key);
    const wrongSize = items.filter(i => remote.has(i.key) && remote.get(i.key) !== i.size).map(i => i.key);
    const extra = [...remote.keys()].filter(key => !keys.has(key));
    const current = scan(project, meta);
    if (current.length !== items.length || current.some((i,n) => i.key !== items[n].key || i.size !== items[n].size || i.mtimeMs !== items[n].mtimeMs)) fail('LOCAL_CATALOG_CHANGED');
    report.verification = { remoteCount: remote.size, matched: items.length - missing.length - wrongSize.length, missing, wrongSize, extra };
    console.log(`Verify: matched=${report.verification.matched}; missing=${missing.length}; wrongSize=${wrongSize.length}; extra=${extra.length}`);
    if (missing.length || wrongSize.length || extra.length) fail('FINAL_VERIFICATION_FAILED');
  }
  try {
    save();
    if (mode === '--test') {
      const item = items[0];
      await upload(item);
      const got = await send(new GetObjectCommand({ Bucket: BUCKET, Key: item.key }));
      const bytes = Buffer.from(await got.Body.transformToByteArray());
      if (got.ContentType !== 'image/webp' || bytes.length !== item.size || digest(bytes) !== digest(fs.readFileSync(item.file))) fail('TEST_CONTENT_MISMATCH');
      report.test = { key: item.key, size: item.size, sha256: digest(bytes), contentType: got.ContentType };
      console.log(`Test: ${item.key}; ${item.size} bytes; SHA-256 matches.`);
    } else if (mode === '--upload') {
      let next = 0, processed = 0, stop = false;
      await Promise.all(Array.from({ length: concurrency }, async () => {
        while (!stop && !abort.signal.aborted && next < items.length) {
          const item = items[next++];
          try { await upload(item); }
          catch (e) {
            report.failures.push({ key: item.key, error: safeError(e) });
            if ([401,403].includes(e?.$metadata?.httpStatusCode) || report.failures.length >= 20) stop = true;
          }
          processed++;
          if (processed % 100 === 0) { console.log(`${processed}/${items.length}: uploaded=${report.uploaded}; skipped=${report.skipped}; errors=${report.failures.length}`); save(); }
        }
      }));
      if (abort.signal.aborted) fail('INTERRUPTED_RESUME_WITH_SAME_COMMAND');
      await verifyAll();
      if (report.failures.length) fail('UPLOAD_ERRORS_RETRY_REQUIRED');
    } else await verifyAll();
    report.pass = true;
    console.log(`PASS; uploaded=${report.uploaded}; skipped=${report.skipped}`);
  } catch (e) { report.pass = false; report.error = safeError(e); throw e; }
  finally { report.finished = new Date().toISOString(); save(); client.destroy(); process.removeListener('SIGINT', onInterrupt); console.log(`Report: ${reportFile}`); }
}
if (require.main === module) main().catch(e => { console.error(`FAIL: ${safeError(e)}`); process.exitCode = 1; });
module.exports = { safeError, digest, walk, scan };
