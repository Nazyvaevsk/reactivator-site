// Run after npm run build. Real Next server over HTTP; no real relay or credentials.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { client } = require('./test-application-transport.cjs');
const sharp = require('sharp');

async function main() {
  const missingSharp = process.argv.includes('--missing-sharp');
  const listener = require('node:net').createServer();
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  const child = spawn(process.execPath, ['--require', path.resolve('scripts/fixtures/relay-preload.cjs'),
    ...(missingSharp ? ['--require', path.resolve('scripts/fixtures/missing-sharp-preload.cjs')] : []),
    'node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, NODE_ENV: 'production', MASTER_CHAT_ID: 'offline-chat', RELAY_SECRET: 'offline-secret' },
    stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  });
  let output = ''; child.stdout.on('data', data => { output += data; }); child.stderr.on('data', data => { output += data; });
  try {
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw Error('Next server exited');
      try { await fetch(base + '/api/send-telegram', { signal: AbortSignal.timeout(1000) }); ready = true; break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'Next readiness timeout');
    if (missingSharp) {
      const c = client(async (url, init) => {
        const response = await fetch(base + url, { ...init, headers: { origin: 'https://www.reactivator55.ru' } });
        assert.equal(response.status, 503);
        assert.match(response.headers.get('content-type'), /application\/json/);
        return response;
      });
      const bytes = await sharp({ create: { width: 4, height: 3, channels: 3, background: '#ff8000' } }).jpeg().toBuffer();
      c.fill([new File([bytes], 'photo.jpg', { type: 'image/jpeg' })]);
      await c.submit();
      assert.equal(c.alerts.length, 1);
      assert.match(c.alerts[0], /Обработка фотографий временно недоступна/, output);
      assert.equal(c.find(n => n.props?.type === 'submit').props.disabled, false);
      console.log('PASS: compiled Next returns JSON 503 and form recovers when sharp cannot load.');
      return;
    }
    for (const count of [1, 10]) {
      let lost = true;
      const c = client(async (url, init) => {
        const response = await fetch(base + url, { ...init, headers: { origin: 'https://www.reactivator55.ru' } });
        assert.equal(response.status, 200, `Next status ${response.status}; ${output}`);
        assert.match(response.headers.get('content-type'), /application\/json/);
        assert.ok(response.headers.get('x-request-id'));
        // Lose the first successful response and exercise actual component retry.
        if (lost) { lost = false; await response.text(); return new Response('', { status: 504 }); }
        return response;
      });
      const files = [];
      for (let i = 0; i < count; i++) {
        const bytes = await sharp({ create: { width: 8, height: 8, channels: 3, background: { r: count * 10, g: i * 20, b: 0 } } }).jpeg().toBuffer();
        files.push(new File([bytes], `photo-${i}.jpg`, { type: 'image/jpeg', lastModified: 1 }));
      }
      c.fill(files);
      c.find(n => n.type === "textarea").props.onChange({ target: { value: `Повреждена дверь, фотографий: ${count}` } });
      await c.submit(); assert.equal(c.alerts.length, 1);
      await c.submit(); assert.equal(c.alerts.length, 1, JSON.stringify({ count, alerts: c.alerts, logs: c.logs, output }));
      assert.equal(c.find(n => n.type === 'form'), undefined);
    }
    assert.ok(output.includes('"stage":"complete"'));
    assert.doesNotMatch(output, /offline-secret|9512345678|Анна/);
    console.log(`PASS: production Next HTTP + actual form handlers + serialized relay mock, 1/10 photos, lost response/retry; ${process.version}.`);
  } finally {
    child.kill();
    await new Promise(resolve => child.exitCode !== null ? resolve() : child.once('exit', resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
