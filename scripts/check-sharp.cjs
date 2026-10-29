// Run in the final runtime, after pruning dev dependencies, before accepting traffic.
// A successful import alone is insufficient: exercise the native decoder as the route does.
async function checkSharp(load = () => require('sharp')) {
  const sharp = load();
  for (const format of ['jpeg', 'png', 'webp']) {
    const bytes = await sharp({ create: { width: 4, height: 3, channels: 3, background: '#ff8000' } })[format]().toBuffer();
    const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: 'warning', animated: true }).timeout({ seconds: 5 });
    const metadata = await image.metadata();
    await image.stats();
    if (metadata.format !== format || metadata.width !== 4 || metadata.height !== 3) throw Error('Decoder self-check failed');
  }
  return { sharp: sharp.versions.sharp, vips: sharp.versions.vips };
}
module.exports = { checkSharp };
if (require.main === module) {
  const runtime = { node: process.version, platform: process.platform, arch: process.arch };
  checkSharp().then(versions => {
    console.info(JSON.stringify({ event: 'sharp_runtime_check', ok: true, ...runtime, ...versions }));
  }).catch(() => {
    console.error(JSON.stringify({ event: 'sharp_runtime_check', ok: false, ...runtime,
      action: 'Reinstall on the target OS with npm ci --include=optional; check libc/CPU compatibility. Do not reuse node_modules from another OS.' }));
    process.exitCode = 1;
  });
}
