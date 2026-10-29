const { spawnSync } = require('node:child_process');
for (const name of ['sharp-runtime', 'knowledge', 'body-issue', 'security', 'application-security', 'application-transport']) {
  const result = spawnSync(process.execPath, [`scripts/test-${name}.cjs`], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || String(result.error || 'Test failed'));
    process.exit(result.status || 1);
  }
  console.log(result.stdout.trim().split(/\r?\n/).at(-1));
}
