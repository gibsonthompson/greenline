// Client-side photo pipeline (build spec 8.3).
// iPhone photo libraries are full of HEIC. No browser renders image/heic
// natively, and iOS does not reliably transcode files picked from the
// library. Pipeline: decode (native first, heic2any WASM fallback),
// downscale to 1600px long edge, re-encode JPEG q0.82. Drawing to a
// canvas discards ALL EXIF including GPS, so customer home coordinates
// never reach storage.

export type ProcessedPhoto = {
  blob: Blob;
  width: number;
  height: number;
  name: string;
};

const LONG_EDGE = 1600;
const QUALITY = 0.82;

function isHeicLike(file: File): boolean {
  const t = file.type.toLowerCase();
  const n = file.name.toLowerCase();
  return t.includes("heic") || t.includes("heif") || n.endsWith(".heic") || n.endsWith(".heif");
}

async function decodeNative(file: Blob): Promise<ImageBitmap> {
  // imageOrientation applies the EXIF rotation before we discard EXIF.
  return createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
}

async function decodeHeicFallback(file: File): Promise<ImageBitmap> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
  const blob = Array.isArray(out) ? out[0] : out;
  return decodeNative(blob);
}

export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  let bmp: ImageBitmap;
  try {
    bmp = await decodeNative(file);
  } catch {
    if (!isHeicLike(file)) throw new Error("unreadable");
    bmp = await decodeHeicFallback(file);
  }

  const scale = Math.min(1, LONG_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);

  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), { width: w, height: h });
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d") as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const blob: Blob =
    "convertToBlob" in canvas
      ? await (canvas as OffscreenCanvas).convertToBlob({ type: "image/jpeg", quality: QUALITY })
      : await new Promise<Blob>((resolve, reject) =>
          (canvas as HTMLCanvasElement).toBlob(
            (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
            "image/jpeg",
            QUALITY
          )
        );

  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  return { blob, width: w, height: h, name: `${base}.jpg` };
}
