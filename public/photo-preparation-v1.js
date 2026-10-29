/* Client-only photo conversion. No network uploads, names, EXIF or decoder errors logged. */
/* global libheif */
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 3200;
const text = (bytes, start, length) => String.fromCharCode(...bytes.subarray(start, start + length));

function formatOf(bytes) {
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpeg";
  if (bytes.length >= 8 && text(bytes, 1, 3) === "PNG" && bytes[0] === 137 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) return "png";
  if (text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 4) === "WEBP") return "webp";
  if (text(bytes, 4, 4) === "ftyp") {
    const size = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0);
    if (size < 16 || size > bytes.length || size > 4096) throw Error("invalid");
    const brands = [text(bytes, 8, 4)];
    for (let offset = 16; offset + 4 <= size; offset += 4) brands.push(text(bytes, offset, 4));
    if (brands.some(brand => ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"].includes(brand))) return "heif";
  }
  throw Error("unsupported");
}

function rejectAnimation(bytes, format) {
  // Converting the first frame must not bypass the server's animation ban.
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (format === "png") {
    for (let offset = 8; offset + 12 <= bytes.length;) {
      const size = view.getUint32(offset);
      if (text(bytes, offset + 4, 4) === "acTL") throw Error("unsupported");
      if (size > bytes.length - offset - 12) throw Error("invalid");
      offset += size + 12;
    }
  }
  if (format === "webp") {
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const size = view.getUint32(offset + 4, true);
      if (["ANIM", "ANMF"].includes(text(bytes, offset, 4))) throw Error("unsupported");
      if (size > bytes.length - offset - 8) throw Error("invalid");
      offset += 8 + size + (size % 2);
    }
  }
}

async function decodeHeif(bytes) {
  // Versioned, self-hosted, loaded only for actual HEIF file signatures.
  importScripts("/photo-codecs/libheif-1.23.5.js");
  const heif = libheif({ print: () => {}, printErr: () => {} });
  const images = new heif.HeifDecoder().decode(bytes);
  try {
    // Ignore thumbnails/depth/HDR auxiliary images; display the primary photograph.
    const photo = images.find(image => image.is_primary()) || images[0];
    if (!photo) throw Error("invalid");
    const width = photo.get_width(), height = photo.get_height();
    if (!width || !height || width * height > 64_000_000) throw Error("invalid");
    const pixels = await new Promise((resolve, reject) => {
      photo.display({ data: new Uint8ClampedArray(width * height * 4), width, height }, data => data ? resolve(data) : reject(Error("invalid")));
    });
    // libheif applies HEIF irot/imir transforms. Do not apply EXIF a second time.
    const bitmap = await createImageBitmap(new ImageData(pixels.data, pixels.width, pixels.height));
    return bitmap;
  } finally { images.forEach(image => image.free()); }
}

async function prepare(file) {
  if (!(file instanceof Blob) || !file.size || file.size > 100 * 1024 * 1024) throw Error("invalid");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const format = formatOf(bytes);
  rejectAnimation(bytes, format);
  // Fix MIME using content, not the filename or caller-supplied MIME type.
  // Native resize at decode time limits pixel allocation for 48/108/200 MP JPEGs.
  const bitmap = format === "heif" ? await decodeHeif(bytes) : await createImageBitmap(
    new Blob([bytes], { type: "image/" + format }),
    { imageOrientation: "from-image", resizeWidth: MAX_EDGE, resizeQuality: "high" },
  );
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw Error("invalid");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    for (const quality of [0.9, 0.84, 0.76, 0.66, 0.55]) {
      const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
      if (blob.size && blob.size <= MAX_BYTES) return blob;
    }
    throw Error("invalid");
  } finally { bitmap.close(); }
}

self.onmessage = async event => {
  try { self.postMessage({ ok: true, blob: await prepare(event.data) }); }
  catch (error) { self.postMessage({ ok: false, code: error?.message === "unsupported" ? "unsupported" : "invalid" }); }
};
