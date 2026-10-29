// Entirely offline: real handlers/decoder, synthetic credentials, in-memory relay.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const sharp = require('sharp');

function harness(options = {}) {
  const modules = new Map(), calls = [], logs = [];
  const env = { NODE_ENV: 'production', MASTER_CHAT_ID: 'offline-chat', RELAY_SECRET: 'offline-secret' };
  function load(file) {
    file = path.resolve(file);
    if (modules.has(file)) return modules.get(file);
    const exports = {}; modules.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText;
    vm.runInNewContext(code, { exports, require: id => {
      if (id === 'server-only') return {};
      if (id === 'next/server') return { NextResponse: Response };
      if (options.modules?.[id]) return options.modules[id];
      if (id.startsWith('@/')) return load(id.slice(2) + '.ts');
      if (id.startsWith('./')) return load(path.join(path.dirname(file), id + '.ts'));
      return require(id);
    }, process: { env, cwd: () => process.cwd() }, Buffer, URL, Request, Response, FormData, File, Blob, AbortSignal,
    setTimeout, clearTimeout, console: { info: value => logs.push(value), error: (...args) => logs.push(args.join(' ')) },
    fetch: async (_, init) => {
      calls.push({ method: init.body.get('method'), text: init.body.get('text'), photo: init.body.get('photo') });
      if (options.fetch) return options.fetch(init, calls);
      return Response.json({ ok: true });
    } });
    return exports;
  }
  const route = load('app/api/send-telegram/route.ts');
  const id = crypto.randomUUID();
  async function post(fields = {}, file, extraHeaders = {}, idOverride = id) {
    const form = new FormData();
    const values = { name: 'Анна-Мария', phone: '+7 (951) 234-56-78', description: 'Повреждена передняя дверь',
      mode: 'body-dimensions-search', sendMessage: 'true', submissionId: idOverride, ...fields };
    for (const [key, value] of Object.entries(values)) if (value !== undefined) form.set(key, value);
    if (file) form.set('photo', file);
    return route.POST(new Request('https://www.reactivator55.ru/api/send-telegram', {
      method: 'POST', headers: { origin: 'https://www.reactivator55.ru', 'x-forwarded-for': '192.0.2.10', ...extraHeaders }, body: form,
    }));
  }
  return { load, post, calls, logs, env, id, route };
}

async function main() {
  const h = harness();
  const validation = h.load('lib/contactValidation.ts');
  for (const number of ['+79512345678', '89512345678', '9512345678', '+7 (951) 234-56-78'])
    assert.equal(validation.normalizePhone(number), '+79512345678');
  for (const number of ['+7 (375) 999-999999', '+79518888888', '1'.repeat(12), '1'.repeat(15), '1'.repeat(16),
    '++79512345678', '+7abc9512345678', '+49512345678', '+795123456789', '951234567'])
    assert.equal(validation.normalizePhone(number), null, number);
  for (const name of ['Анна', 'Илья', 'Ли', "Jean-Luc O’Neill"]) assert.equal(validation.validName(name), true);
  assert.equal(validation.validName('Имя\nТелефон: подмена'), false);
  assert.equal(validation.validDescription('ррррррр'), false);
  assert.equal(validation.validDescription('Дверь после ДТП\nНужна оценка.'), true);
  for (const fields of [{ phone: '+7 (375) 999-999999' }, { phone: '+79518888888' },
    { website: 'spam.invalid' }, { name: 'X\nY' }, { description: 'ррррррр' },
    { photoCount: '11' }, { submissionId: 'x' }]) assert.equal((await h.post(fields)).status, 400);
  assert.equal(h.calls.length, 0);
  for (const headers of [{ origin: '' }, { origin: 'https://evil.test' }, { 'sec-fetch-site': 'cross-site' }])
    assert.equal((await h.post({}, undefined, headers)).status, 403);
  // A forged allowed Origin is intentionally not treated as human authentication.
  let response = await h.post(); assert.equal(response.status, 200);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.ok(response.headers.get('x-request-id'));
  assert.match(h.calls[0].text, /\+79512345678/);
  assert.equal((await h.post()).status, 200); assert.equal(h.calls.length, 1);
  assert.equal((await h.post({}, undefined, {}, crypto.randomUUID())).status, 409);
  assert.equal((await h.post({ description: 'Подмена содержания заявки' })).status, 403);
  assert.ok(h.logs.every(line => !line.includes('9512345678') && !line.includes('Анна-Мария') && !line.includes('offline-secret')));

  const bytes = await sharp({ create: { width: 4, height: 3, channels: 3, background: '#ff8000' } }).jpeg().toBuffer();
  const image = () => new File([bytes], '../untrusted.svg', { type: 'image/svg+xml' });
  const p = harness(); const repair = { mode: 'repair', photoCount: '10', photoIndex: '0' };
  assert.equal((await p.post({ ...repair, sendMessage: 'false' }, image())).status, 403);
  assert.equal((await p.post(repair, new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' }))).status, 400);
  assert.equal((await p.post(repair, new File(['<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"/>'], 'x.svg', { type: 'image/svg+xml' }))).status, 400);
  assert.equal((await p.post(repair, new File([bytes.subarray(0, 40)], 'truncated.jpg', { type: 'image/jpeg' }))).status, 400);
  response = await p.post(repair, image()); assert.equal(response.status, 200);
  let receipt = await response.json(); assert.match(receipt.uploadToken, /^[a-f0-9]{64}$/);
  assert.equal(p.calls.length, 2); assert.equal(p.calls[1].photo.type, 'image/jpeg');
  assert.equal(p.calls[1].photo.name, 'photo.jpg');
  // Retried first request and each later index must be idempotent.
  assert.equal((await p.post(repair, image())).status, 200); assert.equal(p.calls.length, 2);
  assert.equal((await p.post({ ...repair, sendMessage: 'false', photoIndex: '1', uploadToken: 'forged' }, image())).status, 403);
  assert.equal((await p.post({ ...repair, sendMessage: 'false', photoIndex: '2', uploadToken: receipt.uploadToken }, image())).status, 400);
  for (let index = 1; index < 10; index++) {
    const fields = { ...repair, sendMessage: 'false', photoIndex: String(index), uploadToken: receipt.uploadToken };
    assert.equal((await p.post(fields, image())).status, 200);
    const before = p.calls.length;
    assert.equal((await p.post(fields, image())).status, 200);
    assert.equal(p.calls.length, before);
  }
  assert.equal(p.calls.filter(call => call.method === 'sendPhoto').length, 10);
  assert.equal(p.calls.filter(call => call.method === 'sendMessage').length, 1);
  assert.equal((await p.post({ ...repair, sendMessage: 'false', photoIndex: '10', uploadToken: receipt.uploadToken }, image())).status, 400);
  for (const format of ['png', 'webp']) {
    const other = harness();
    const content = await sharp(bytes)[format]().toBuffer();
    assert.equal((await other.post({ ...repair, photoCount: '1' }, new File([content], 'photo.' + format))).status, 200);
    assert.equal(other.calls[1].photo.type, 'image/' + format);
  }
  const large = harness();
  assert.equal((await large.post(repair, new File([Buffer.alloc(10 * 1024 * 1024 + 1)], 'large.jpg'))).status, 400);
  assert.equal(large.calls.length, 0);

  for (const reply of [() => Response.json({ ok: false }), () => new Response('not JSON'), () => Response.json({}), () => { throw Error('network'); }]) {
    const broken = harness({ fetch: reply });
    assert.ok((await broken.post()).status >= 500);
    assert.equal((await broken.post()).status, 409);
    assert.equal(broken.calls.length, 1, 'never retry ambiguous delivery');
  }
  const photoFailure = harness({ fetch: (_, calls) => Response.json({ ok: calls.length === 1 }) });
  assert.equal((await photoFailure.post(repair, image())).status, 502);
  assert.equal((await photoFailure.post(repair, image())).status, 409);
  assert.equal(photoFailure.calls.length, 2);
  let release;
  const concurrent = harness({ fetch: () => new Promise(resolve => { release = resolve; }) });
  const pending = concurrent.post();
  while (!release) await new Promise(resolve => setTimeout(resolve, 1));
  assert.equal((await concurrent.post()).status, 409);
  release(Response.json({ ok: true })); assert.equal((await pending).status, 200);

  const reader = h.load('lib/boundedBody.ts');
  const oversized = new Request('https://example.test', { method: 'POST', body: 'abcd' });
  await assert.rejects(reader.readBoundedBody(oversized, 3), error => error.status === 413);
  const slow = { headers: new Headers(), body: new ReadableStream({ start() {} }) };
  await assert.rejects(reader.readBoundedBody(slow, 100, 10), error => error.status === 408);
  const limiter = h.load('lib/rateLimit.ts');
  assert.equal(limiter.clientKey(new Request('https://example.test', { headers: { 'x-forwarded-for': 'fe80::1%eth0' } })), 'unknown');
  h.env.CLIENT_IP_HEADER = 'x-real-ip';
  assert.equal(limiter.clientKey(new Request('https://example.test', { headers: { 'x-real-ip': '192.0.2.1', 'x-forwarded-for': '192.0.2.2' } })),
    crypto.createHash('sha256').update('192.0.2.1').digest('hex'));
  delete h.env.CLIENT_IP_HEADER;
  const unknown = new Request('https://example.test');
  for (let index = 0; index < 4; index++) assert.equal(limiter.rateLimit(unknown, 'unknown', 1, 1000, 5), null);
  assert.equal(limiter.rateLimit(unknown, 'unknown', 1, 1000, 5), null);
  assert.equal(limiter.rateLimit(unknown, 'unknown', 1, 1000, 5).status, 429);
  const uploads = h.load('lib/applicationUploads.ts');
  const old = uploads.acquireSubmission('expiring', 'fingerprint', '', true, 1, 0); old.busy = false;
  assert.throws(() => uploads.acquireSubmission('expiring', 'fingerprint', old.token, false, 1, 16 * 60_000), error => error.status === 403);
  const access = h.load('lib/bodyAccess.ts');
  h.env.BODY_DIMENSIONS_ACCESS_SECRET = 'offline-access';
  const exp = String(Math.floor(Date.now() / 1000) + 86400);
  const sig = crypto.createHmac('sha256', h.env.BODY_DIMENSIONS_ACCESS_SECRET).update('S04435.' + exp).digest('hex');
  assert.equal(access.verifyBodyAccess('S04435', exp, sig), true);
  for (const args of [['OTHER', exp, sig], ['S04435', String(Number(exp) + 1), sig], ['../S04435', exp, sig],
    ['S04435', exp, sig.slice(1)], [['S04435'], exp, sig], ['S04435', exp, [sig]]]) assert.equal(access.verifyBodyAccess(...args), false);
  const expired = String(Math.floor(Date.now() / 1000) - 1);
  assert.equal(access.verifyBodyAccess('S04435', expired, crypto.createHmac('sha256', h.env.BODY_DIMENSIONS_ACCESS_SECRET).update('S04435.' + expired).digest('hex')), false);
  const catalog = h.load('lib/bodyDimensionsData.ts');
  assert.equal(catalog.getBodyDimensionsGroup('../S04435'), null);
  assert.equal(catalog.getBodyDimensionsGroup('__proto__'), null);
  assert.equal(catalog.getSheetObjectKey({ sheets: [{ assetKey: 'groups/A/../sheet_001.svg' }] }, 'sheet_001.svg'), null);
  assert.equal(catalog.getSheetObjectKey({ sheets: [{ assetKey: 'groups/A/sheet_001.svg' }] }, 'sheet_002.svg'), null);
  assert.equal(catalog.getSheetObjectKey({ sheets: [{ assetKey: 'groups/A/sheet_001.svg' }] }, 'sheet_001.svg'), 'groups/A/sheet_001.svg');
  let storageMode = 'ok';
  class StorageException extends Error { constructor(name) { super(name); this.name = name; } }
  const storage = harness({ modules: { '@aws-sdk/client-s3': {
    GetObjectCommand: class { constructor(input) { this.input = input; } },
    S3ServiceException: StorageException,
    S3Client: class { async send(command) {
      assert.equal(command.input.Bucket, 'reactivator-body-dimensions');
      assert.equal(command.input.Key, 'groups/A/sheet_001.svg');
      if (storageMode === 'missing') throw new StorageException('NoSuchKey');
      if (storageMode === 'error') throw Error('sensitive SDK diagnostics');
      return { Body: { transformToWebStream: () => new Response('<svg/>').body } };
    } },
  } } });
  Object.assign(storage.env, { R2_ACCOUNT_ID: 'a'.repeat(32), R2_ACCESS_KEY_ID: 'offline-key', R2_SECRET_ACCESS_KEY: 'offline-secret' });
  const r2 = storage.load('lib/bodyDimensionsR2.ts');
  assert.equal(Buffer.from(await r2.readR2Sheet('groups/A/sheet_001.svg')).toString(), '<svg/>');
  storageMode = 'missing'; assert.equal(await r2.readR2Sheet('groups/A/sheet_001.svg'), null);
  storageMode = 'error'; await assert.rejects(r2.readR2Sheet('groups/A/sheet_001.svg'), error => error.message === 'Body dimensions storage is unavailable');
  console.log('PASS: phone, honeypot, validation, Origin limits, deduplication, ten bound photos, retry/concurrency, decoded formats, relay errors, deadlines, expiry and unknown-IP global limits.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
