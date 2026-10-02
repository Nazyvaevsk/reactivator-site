// Runs entirely offline with synthetic secrets; never reads .env.local or contacts Telegram/R2.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
const env = {
  BODY_DIMENSIONS_ISSUE_SECRET: 'test-only-issue-secret-'.repeat(3),
  BODY_DIMENSIONS_ACCESS_SECRET: 'test-only-access-secret',
  BODY_DIMENSIONS_BASE_URL: 'https://example.test',
  MASTER_CHAT_ID: '123', RELAY_SECRET: 'test-relay',
};
function load(file, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, require: id => id === 'server-only' ? {} : mocks[id] ?? require(id), process: { env }, Buffer, URL, URLSearchParams, Response, Request, FormData, File, console, fetch: async (...args) => mocks.fetch(...args) }, { filename: file });
  return exports;
}
async function main() {
  const lib = load('lib/bodyIssue.ts');
  const access = load('lib/bodyAccess.ts');
  const now = Math.floor(Date.now()/1000);
  const token = new URL(lib.createBodyIssueUrl('S04435', now)).hash.slice(1);
  assert.equal(lib.verifyBodyIssueToken(token, now), 'S04435');
  assert.equal(lib.verifyBodyIssueToken(token.replace('S04435','S04436'), now), null);
  assert.equal(lib.verifyBodyIssueToken(token.slice(0,-1)+'z', now), null);
  assert.equal(lib.verifyBodyIssueToken(token, now+7*86400), null);
  assert.equal(lib.verifyBodyIssueToken(token, now-1), null);
  env.MASTER_CHAT_ID='456'; assert.equal(lib.verifyBodyIssueToken(token, now), null); env.MASTER_CHAT_ID='123';
  const issued = lib.createIssuedBodyAccess('S04435', now);
  assert.equal(issued.expiresAt-now, 86400);
  const url = new URL(issued.url);
  assert.equal(url.pathname, '/body-dimensions/access');
  assert.equal(access.verifyBodyAccess('S04435',url.searchParams.get('exp'),url.searchParams.get('sig')),true);
  assert.equal(access.verifyBodyAccess('S04436',url.searchParams.get('exp'),url.searchParams.get('sig')),false);
  // Customer signatures must never authorize issuance.
  assert.equal(lib.verifyBodyIssueToken('S04435.'+(now+86400)+'.'+'a'.repeat(32)+'.'+url.searchParams.get('sig'),now),null);
  const group = {groupId:'S04435',make:'Acura',model:'Test',year:'2000',sheetCount:3};
  const data = {getBodyDimensionsGroup: id => id === 'S04435' ? group : null};
  const route = load('app/body-dimensions/issue/route.ts', {'@/lib/bodyIssue':lib,'@/lib/bodyDimensionsData':data});
  const page = route.GET(); const html=await page.text();
  assert.match(page.headers.get('cache-control'),/no-store/);
  assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  assert.ok(!html.includes(env.BODY_DIMENSIONS_ISSUE_SECRET));
  assert.ok(!html.includes('/body-dimensions/access?'));
  const post = (body,origin='https://example.test') => route.POST(new Request('https://example.test/body-dimensions/issue',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)}));
  let response=await post({token,action:'inspect'}); assert.equal(response.status,200); assert.equal((await response.json()).url,undefined);
  response=await post({token,action:'issue'}); assert.equal(response.status,200); assert.equal(new URL((await response.json()).url).searchParams.get('group'),'S04435');
  assert.equal((await post({token,action:'issue'},'https://evil.test')).status,403);
  assert.equal((await post({token:'invalid',action:'issue'})).status,403);
  assert.equal((await post({token,action:'invalid'})).status,400);
  assert.equal((await post({token:'x'.repeat(3000),action:'issue'})).status,413);
  assert.equal((await post({token:new URL(lib.createBodyIssueUrl('UNKNOWN')).hash.slice(1),action:'issue'})).status,404);
  let sent;
  const telegram = load('app/api/send-telegram/route.ts',{'@/lib/bodyIssue':lib,'@/lib/bodyDimensionsData':data,'next/server':{NextResponse:Response},fetch:async (url,opts)=>{sent=opts.body;return Response.json({ok:true});}});
  const submit=async (id)=>{const form=new FormData();for(const [k,v] of Object.entries({mode:'body-dimensions',groupId:id,name:'Test',phone:'1234567890',description:'Forged group and price'}))form.set(k,v);return telegram.POST(new Request('https://example.test/api/send-telegram',{method:'POST',body:form}));};
  response=await submit('S04435');assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{success:true});
  assert.match(sent.get('text'),/Комплект: S04435/);assert.ok(!sent.get('text').includes('Forged'));
  const button=JSON.parse(sent.get('reply_markup')).inline_keyboard[0][0];
  assert.equal(lib.verifyBodyIssueToken(new URL(button.url).hash.slice(1)),'S04435');
  assert.equal((await submit('UNKNOWN')).status,400);
  delete env.BODY_DIMENSIONS_ISSUE_SECRET;
  assert.equal((await post({token,action:'issue'})).status,503);
  assert.equal((await submit('S04435')).status,503);
  console.log('PASS: issuance signatures, expiry, group/chat binding, access compatibility, GET/inspect without issuance, origin checks, payload bounds, Telegram payload and fail-closed configuration.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
