const assert = require('node:assert/strict');
const { checkSharp } = require('./check-sharp.cjs');
async function main() {
  const pkg = require('../package.json');
  const lock = require('../package-lock.json');
  assert.equal(pkg.dependencies.sharp, '0.35.5');
  assert.equal(pkg.devDependencies.sharp, undefined);
  assert.equal(lock.packages[''].dependencies.sharp, pkg.dependencies.sharp);
  assert.ok(!lock.packages['node_modules/sharp'].devOptional);
  for (const platform of ['linux-x64', 'linuxmusl-x64']) {
    for (const name of [`@img/sharp-${platform}`, `@img/sharp-libvips-${platform}`]) {
      const entry = lock.packages[`node_modules/${name}`];
      assert.ok(entry, name);
      assert.ok(!entry.dev && !entry.devOptional, name);
      assert.deepEqual(entry.os, ['linux']);
      assert.deepEqual(entry.cpu, ['x64']);
      assert.ok(entry.integrity && entry.resolved);
      assert.equal(entry.version, lock.packages['node_modules/sharp'].optionalDependencies[name]);
    }
  }
  assert.match(require('node:fs').readFileSync('.npmrc', 'utf8'), /^include=optional/m);
  const versions = await checkSharp(); assert.equal(versions.sharp, '0.35.5');
  await assert.rejects(checkSharp(() => { throw Error('native binary absent'); }));
  await assert.rejects(checkSharp(() => () => { throw Error('decoder failed'); }));
  const failedStart = require('node:child_process').spawnSync(process.execPath,
    ['--require', './scripts/fixtures/missing-sharp-preload.cjs', 'scripts/check-sharp.cjs'], { encoding: 'utf8', windowsHide: true });
  assert.equal(failedStart.status, 1);
  assert.equal(JSON.parse(failedStart.stderr).ok, false);
  assert.doesNotMatch(failedStart.stderr, /Simulated|stack/);
  console.log('PASS: sharp production dependency, Linux glibc/musl x64 lockfile, native JPEG/PNG/WebP self-check, missing/broken decoder rejection.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
