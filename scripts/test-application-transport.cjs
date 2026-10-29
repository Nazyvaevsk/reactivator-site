// Offline: execute the actual component handlers, multipart route and image decoder.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { harness } = require('./test-application-security.cjs');

function client(fetch, fastTimers = false) {
  const slots = [], logs = [], alerts = [], modules = new Map();
  let cursor = 0;
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    useContext: () => {},
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useRef(initial) {
      const i = cursor++;
      return slots[i] ??= { current: initial };
    },
  };
  function load(file) {
    if (modules.has(file)) return modules.get(file);
    const exports = {}; modules.set(file, exports);
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
    } }).outputText, { exports, require: id => id === 'react' ? react : id === '../lib/preparePhoto' ? { preparePhotoForUpload: async file => file } : id.startsWith('@/') ? load(id.slice(2) + '.ts') : require(id),
      Error, fetch, FormData, File, Blob, AbortController, setTimeout: fastTimers ? (fn, ms) => setTimeout(fn, Math.min(ms, 10)) : setTimeout, clearTimeout, crypto: require('node:crypto').webcrypto,
      window: {}, alert: value => alerts.push(value), console: { error: (...args) => logs.push(args) },
    });
    return exports;
  }
  const Component = load('app/ApplicationFormProvider.tsx').default;
  const render = () => { cursor = 0; return Component({ children: null }); };
  function find(predicate, node = render()) {
    if (!node || typeof node !== 'object') return;
    if (predicate(node)) return node;
    for (const child of [node.props?.children].flat(Infinity)) {
      const found = find(predicate, child ?? null); if (found) return found;
    }
  }
  const input = type => find(node => node.type === 'input' && node.props.type === type);
  function fill(files) {
    render().props.value();
    find(n => n.props?.placeholder === 'Как к вам обращаться').props.onChange({ target: { value: 'Анна' } });
    input('tel').props.onChange({ target: { value: '+79512345678' } });
    find(n => n.type === 'textarea').props.onChange({ target: { value: 'Повреждена передняя дверь' } });
    input('file').props.onChange({ target: { files } });
  }
  return { load, fill, find, alerts, logs, submit: () => find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }) };
}

async function main() {
  const bytes = await require('sharp')({ create: { width: 8, height: 8, channels: 3, background: '#ff8800' } }).jpeg().toBuffer();
  const file = () => new File([bytes], 'private-photo.jpg', { type: 'image/jpeg', lastModified: 1 });
  const transport = h => async (url, init) => {
    assert.equal(url, '/api/send-telegram');
    // Serialize and parse multipart, rather than passing FormData directly to the handler.
    return h.route.POST(new Request('https://www.reactivator55.ru' + url, {
      ...init, headers: { origin: 'https://www.reactivator55.ru' },
    }));
  };
  for (const count of [1, 10]) {
    const h = harness(), c = client(transport(h));
    c.fill(Array.from({ length: count }, file));
    await c.submit();
    assert.equal(c.alerts.length, 0);
    assert.equal(h.calls.filter(x => x.method === 'sendMessage').length, 1);
    assert.equal(h.calls.filter(x => x.method === 'sendPhoto').length, count);
    assert.equal(c.find(n => n.type === 'form'), undefined);
  }
  for (const response of [
    () => new Response(''), () => new Response('<html>private upstream details</html>', { headers: { 'content-type': 'text/html' } }),
    () => new Response('{', { headers: { 'content-type': 'application/json' } }),
    ...[403, 413, 429, 500, 502, 503, 504].map(status => () => new Response('', { status })),
    () => { throw Error('secret network details'); },
  ]) {
    const h = harness(); let broken = true;
    const c = client((...args) => broken ? response() : transport(h)(...args));
    c.fill([file()]); await c.submit();
    assert.equal(c.alerts.length, 1);
    assert.doesNotMatch(c.alerts[0], /JSON|private upstream|secret network/);
    assert.equal(c.find(n => n.props?.type === 'submit').props.disabled, false);
    assert.equal(c.find(n => n.props?.placeholder === 'Как к вам обращаться').props.value, 'Анна');
    broken = false; await c.submit();
    assert.equal(h.calls.length, 2);
    assert.equal(c.find(n => n.type === 'form'), undefined);
    assert.doesNotMatch(JSON.stringify(c.logs), /private-photo|9512345678|Анна|secret network/);
  }
  // The server succeeded but the response was lost: same ID must not resend text/photo.
  const h = harness(); let lost = true;
  const c = client(async (...args) => {
    const response = await transport(h)(...args);
    if (lost) { lost = false; return new Response('', { status: 504 }); }
    return response;
  });
  c.fill([file()]); await c.submit(); await c.submit();
  assert.equal(h.calls.length, 2);
  assert.equal(c.find(n => n.type === 'form'), undefined);
  // Deadline covers both the fetch and reading a stalled response body.
  for (const fetch of [() => new Promise(() => {}), async () => new Response(new ReadableStream({ start() {} }))]) {
    const c = client(fetch);
    await assert.rejects(c.load('lib/applicationRequest.ts').sendApplicationRequest(new FormData(), 10), e => e.diagnostic.kind === 'timeout');
  }
  const timeoutForm = client(() => new Promise(() => {}), true);
  timeoutForm.fill([file()]); await timeoutForm.submit();
  assert.match(timeoutForm.alerts[0], /Время ожидания/);
  assert.equal(timeoutForm.find(n => n.props?.type === 'submit').props.disabled, false);
  const unavailable = harness({ fetch: () => { throw Error('secret relay details'); } });
  const u = client(transport(unavailable)); u.fill([file()]); await u.submit(); await u.submit();
  assert.equal(unavailable.calls.length, 1);
  assert.equal(u.find(n => n.props?.type === 'submit').props.disabled, false);
  console.log('PASS: actual form handlers + multipart route: 1/10 photos, empty/HTML/malformed JSON, 403/413/429/500/502/503/504, network, deadlines, recovery and lost-response deduplication.');
}
module.exports = { client };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
