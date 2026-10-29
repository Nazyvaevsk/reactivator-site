// Test process only. Block all outgoing fetches except the mocked relay contract.
const assert = require('node:assert/strict');
const deliveries = new Set();
globalThis.fetch = async (url, init) => {
  assert.equal(String(url), 'https://reactivator-telegram-relay.nazyvaevsk.workers.dev');
  assert.equal(init.headers['X-Relay-Secret'], 'offline-secret');
  // Exercise the exact wire serialization the Worker receives.
  const request = new Request(url, init);
  const form = await request.formData();
  assert.equal(form.get('chat_id'), 'offline-chat');
  const method = form.get('method');
  assert.ok(['sendMessage', 'sendPhoto'].includes(method));
  const value = method === 'sendPhoto' ? Buffer.from(await form.get('photo').arrayBuffer()).toString('base64') : form.get('text');
  const key = method + ':' + value;
  assert.ok(!deliveries.has(key), 'duplicate relay delivery');
  deliveries.add(key);
  if (method === 'sendPhoto') {
    assert.equal(form.get('photo').type, 'image/jpeg');
    assert.equal(form.get('photo').name, 'photo.jpg');
  }
  return Response.json({ ok: true, result: { message_id: deliveries.size } });
};
