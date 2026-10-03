// Offline security regression checks, using synthetic credentials and mocked R2/relay.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
function load(file, mocks = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  vm.runInNewContext(code, { exports, require: id => id === 'server-only' ? {} : mocks[id] ?? require(id),
    process:{env:{BODY_DIMENSIONS_ACCESS_SECRET:'offline-secret',NODE_ENV:'production',MASTER_CHAT_ID:'test-chat',RELAY_SECRET:'offline-relay'}},
    Buffer,URL,Response,Request,FormData,File,AbortSignal,console,fetch:mocks.fetch });
  return exports;
}
async function main() {
  const rate = load('lib/rateLimit.ts');
  const request = ip => new Request('https://example.test', {headers:{'x-forwarded-for':ip}});
  assert.equal(rate.clientKey(request('spoof, 192.0.2.1')),rate.clientKey(request('192.0.2.1')));
  assert.equal(rate.clientKey(request('arbitrary')), 'unknown');
  assert.equal(rate.clientKey(request('2001:db8::1')),rate.clientKey(request('2001:0db8:0:0:0:0:0:1')));
  assert.equal(rate.consumeLimit('time',2,1000,0),0);
  assert.equal(rate.consumeLimit('time',2,1000,0),0);
  assert.equal(rate.consumeLimit('time',2,1000,999),1);
  assert.equal(rate.consumeLimit('time',2,1000,1000),0);
  assert.equal(rate.rateLimit(request('192.0.2.1'),'ip',1,60000,10),null);
  const limited=rate.rateLimit(request('192.0.2.1'),'ip',1,60000,10);
  assert.equal(limited.status,429);assert.ok(Number(limited.headers.get('retry-after'))>0);
  assert.equal(rate.rateLimit(request('192.0.2.2'),'ip',1,60000,10),null);
  let release;
  const running=rate.withCapacity('zip',1,()=>new Promise(resolve=>{release=resolve;}));
  assert.equal((await rate.withCapacity('zip',1,async()=>new Response())).status,429);
  release(new Response());await running;
  await assert.rejects(rate.withCapacity('zip',1,async()=>{throw Error('test');}));
  assert.equal((await rate.withCapacity('zip',1,async()=>new Response())).status,200);
  const access=load('lib/bodyAccess.ts');
  const exp=String(Math.floor(Date.now()/1000)+86400);
  const sig=crypto.createHmac('sha256','offline-secret').update('TEST.'+exp).digest('hex');
  const data={getBodyDimensionsGroup:()=>({groupId:'TEST',make:'Test',model:'Car',year:'2000',sheets:[{assetKey:'groups/TEST/sheet_001.svg'}]}),getSheetObjectKey:(_,sheet)=>sheet==='sheet_001.svg'?'groups/TEST/sheet_001.svg':null};
  for(const name of ['sheet','download']) {
    let reads=0;
    const limiter=load('lib/rateLimit.ts');
    const route=load('app/api/body-dimensions/'+name+'/route.ts',{'@/lib/rateLimit':limiter,'@/lib/bodyAccess':access,'@/lib/bodyDimensionsData':data,'next/server':{NextResponse:Response},'@/lib/bodyDimensionsR2':{readR2Sheet:async()=>{reads++;return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');}}});
    const url='https://example.test/api/body-dimensions/'+name+'?group=TEST&exp='+exp+'&sheet=sheet_001.svg';
    assert.equal((await route.GET(new Request(url))).status,403);assert.equal(reads,0);
    assert.equal((await route.GET(new Request(url+'&sig='+sig))).status,200);
    assert.equal((await route.GET(new Request(url,{headers:{authorization:'Bearer '+sig}}))).status,200);
    const limit=name==='sheet'?120:5;
    for(let i=3;i<limit;i++) await route.GET(new Request(url));
    const before=reads;
    assert.equal((await route.GET(new Request(url,{headers:{authorization:'Bearer '+sig}}))).status,429);
    assert.equal(reads,before);
  }
  let relayCalls=0;
  const limiter=load('lib/rateLimit.ts');
  const telegram=load('app/api/send-telegram/route.ts',{'@/lib/rateLimit':limiter,'@/lib/bodyIssue':{},'@/lib/bodyDimensionsData':data,'next/server':{NextResponse:Response},fetch:async()=>{relayCalls++;return Response.json({ok:true});}});
  for(const origin of ['', 'null','https://evil.test'])assert.equal((await telegram.POST(new Request('https://example.test',{method:'POST',headers:{origin}}))).status,403);
  for(let i=0;i<30;i++)await telegram.POST(new Request('https://example.test',{method:'POST',headers:{origin:'https://reactivator55.ru'}}));
  assert.equal((await telegram.POST(new Request('https://example.test',{method:'POST',headers:{origin:'https://reactivator55.ru'}}))).status,429);
  assert.equal(relayCalls,0);
  const photos=load('app/api/send-telegram/route.ts',{'@/lib/rateLimit':load('lib/rateLimit.ts'),'@/lib/bodyIssue':{},'@/lib/bodyDimensionsData':data,'next/server':{NextResponse:Response},fetch:async()=>{relayCalls++;return Response.json({ok:true});}});
  const upload=async first=>{
    const form=new FormData();form.set('name','Test');form.set('phone','1234567890');form.set('description','Repair');form.set('mode','repair');form.set('sendMessage',String(first));form.set('photo',new File(['test-image'],'test.png',{type:'image/png'}));
    return photos.POST(new Request('https://example.test',{method:'POST',headers:{origin:'https://reactivator55.ru'},body:form}));
  };
  for(let i=0;i<10;i++)assert.equal((await upload(i===0)).status,200);
  assert.equal(relayCalls,11);
  assert.equal((await upload(true)).status,200);
  assert.equal((await upload(true)).status,200);
  assert.equal((await upload(true)).status,429);
  assert.equal(relayCalls,15);
  console.log('PASS: expiry/reset, IP isolation, spoofed prefixes, IPv6 normalization, capacity release, old query/new header access, limits before R2/relay, origin rejection.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
