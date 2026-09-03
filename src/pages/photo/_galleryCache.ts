import { getImage } from "astro:assets";
import path from "path";
import { encodeEmbeddings } from "./_utils"; // adjust path as needed
import type { ImageMetadata as AstroImageMetadata } from "astro";
import type { ExifRecord, GalleryImage } from "../../types/content";
import { getMacOSTags } from "../../lib/macos-tags";

const lensReplacements: Record<string, string> = {
  "AF-S DX VR Zoom-Nikkor 18-105mm f/3.5-5.6G ED": "Nikon 18-105mm f/3.5-5.6G DX",
  "Tamron 20-40mm F2.8 Di III VXD": "Tamron 20-40mm F2.8",
  "FE 28-70mm F3.5-5.6 OSS": "Sony 28-70mm F3.5-5.6",
  "AF-S DX Nikkor 35mm f/1.8G": "Nikon 35mm f/1.8G DX",
  "SAMYANG AF 24mm F2.8": "Rokinon 24mm F2.8",
  "Tamron 70-300mm F4.5-6.3 Di III RXD": "Tamron 70-300mm F4.5-6.3",
  "----": "Helios 44/2",
};

const cameraReplacements: Record<string, string> = {
  "ILCE-7C": "Sony a7C",
  "NIKON D3200": "Nikon D3200",
  "ILCE-7": "Sony a7",
  FC3682: "DJI Mini 3",
};

function resolveCamera(exif: ExifRecord): string | undefined {
  for (const x of ["model", "CameraModelName", "Model"]) {
    const value = exif[x];
    if (typeof value === "string" && cameraReplacements[value]) return cameraReplacements[value];
  }
}

function resolveLens(exif: ExifRecord): string | undefined {
  for (const x of ["Lens", "LensModel", "LensSpec"]) {
    const value = exif[x];
    if (typeof value === "string" && lensReplacements[value]) return lensReplacements[value];
  }
}

function resolveShutter(exif: ExifRecord): string | number | undefined {
  let x = exif["ExposureTime"];
  if (typeof x === "string" || typeof x === "number") return x;
}

function resolveAperture(exif: ExifRecord): number | undefined {
  const x = exif["FNumber"];
  if (!x) return undefined;
  let n;
  if (typeof x == "string") {
    n = parseFloat(x);
  } else if (typeof x == "number") {
    n = x;
  }
  if (n === undefined) {
    return undefined;
  }

  if (Math.round(n) === n) {
    return Math.round(n);
  }
  return n;
}

function resolveFocalLength(exif: ExifRecord): number | undefined {
  const focal = exif["FocalLengthIn35mmFormat"];
  if (focal) {
    if (typeof focal == "number") {
      return focal;
    }
    return typeof focal === "string" ? parseFloat(focal) : undefined;
  }
}

// Global memory stores that survive across Astro build iterations
const processedImagesCache = new Map<string, ImageData>();
const optimizedMapImagesCache = new Map<string, GalleryImage>();

interface ProcessImageParams {
  filePath: string;
  module: AstroImageMetadata;
  allowClip: boolean;
  allowMetadata: boolean;
  allowFullscreen: boolean;
  embeddings: Record<string, number[]> | null;
  metadata: Record<string, ExifRecord> | null;
}

export interface ImageMetadata {
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  shutterSpeed?: string;
  iso?: number;
  lon?: number;
  lat?: number;
}

export interface ImageData {
  filePath: string;
  name: string;
  src: AstroImageMetadata;
  width: number;
  height: number;
  highRes?: string;
  aspectRatio: number;
  embeddings?: string;
  metadata?: ImageMetadata;
  macosTags: string[];
}

export async function getSharedProcessedImage({
  filePath,
  module,
  allowClip,
  allowMetadata,
  allowFullscreen,
  embeddings,
  metadata,
}: ProcessImageParams): Promise<ImageData> {
  // Unique cache key based on configuration requirements
  const cacheKey = `${filePath}_clip:${allowClip}_meta:${allowMetadata}_fullscreen:${allowFullscreen}`;
  const cachedImage = processedImagesCache.get(cacheKey);
  if (cachedImage) {
    return cachedImage;
  }

  const filename = path.basename(filePath);
  const name = filename.split(".").slice(0, -1).join(".");
  const width = module.width;
  const height = module.height;
  const aspectRatioNum = width && height ? width / height : 1;

  // ⚡ Heavy Operation: Resizing/compressing via Astro's image service
  const highRes = allowFullscreen
    ? await getImage({
        src: module,
        width: Math.round(Math.sqrt(2500000 / (height * width)) * width),
        quality: 85,
        format: "avif",
      })
    : undefined;

  const out: ImageData = {
    filePath,
    name,
    src: module,
    width,
    height,
    highRes: highRes?.src,
    aspectRatio: aspectRatioNum,
    macosTags: await getMacOSTags(filePath),
  };

  if (allowClip && embeddings) {
    const emb = embeddings[filePath];
    if (emb) out.embeddings = encodeEmbeddings(emb);
  }

  if (allowMetadata && metadata) {
    const exif = metadata[filePath];
    if (exif) {
      out.metadata = {
        camera: resolveCamera(exif),
        lens: resolveLens(exif),
        focalLength: resolveFocalLength(exif),
        aperture: resolveAperture(exif),
        shutterSpeed: (() => {
          const value = resolveShutter(exif);
          return value === undefined ? undefined : String(value);
        })(),
        iso: typeof exif.ISO === "number" ? exif.ISO : undefined,
        lon: typeof exif.GPSLongitude === "number" ? exif.GPSLongitude : undefined,
        lat: typeof exif.GPSLatitude === "number" ? exif.GPSLatitude : undefined,
      };
    }
  }

  processedImagesCache.set(cacheKey, out);
  return out;
}

type MappableImage = ImageData & {
  metadata: ImageMetadata & { lat: number; lon: number };
};

export async function getSharedMapImage(img: MappableImage): Promise<GalleryImage> {
  const cachedMapImage = optimizedMapImagesCache.get(img.filePath);
  if (cachedMapImage) {
    return cachedMapImage;
  }

  const originalAR = img.width / img.height;
  const targetArea = 20000;
  const h = Math.sqrt(targetArea / originalAR);
  const w = targetArea / h;

  // ⚡ Heavy Operation: Generating map thumbnail images
  const optimized = await getImage({
    src: img.src,
    width: Math.round(w),
    height: Math.round(h),
    format: "avif",
  });

  const result = {
    name: img.name,
    path: optimized.src,
    lat: img.metadata.lat,
    lon: img.metadata.lon,
    width: Math.round(w) / 2,
    height: Math.round(h) / 2,
  };

  optimizedMapImagesCache.set(img.filePath, result);
  return result;
}

// A global-to-the-module map that stores the import promises
const moduleCache = new Map<string, AstroImageMetadata>();

export async function getCachedImageModule(
  filePath: string,
  modulePromise?: () => Promise<{
    default: AstroImageMetadata;
  }>,
) {
  const cached = moduleCache.get(filePath);
  if (cached) {
    return cached;
  }

  if (!modulePromise) {
    throw new Error(`File path not found in glob: ${filePath}`);
  }

  const module = (await modulePromise()).default;

  moduleCache.set(filePath, module);
  return module;
}

type AssetGlob = Record<string, () => Promise<{ default: AstroImageMetadata }>>;

let portfolioAssetGlobCache: AssetGlob | null = null;

export function getCachedPortfolioAssetGlob(): AssetGlob {
  if (portfolioAssetGlobCache) {
    return portfolioAssetGlobCache;
  }

  // 2. Pass the ImageModule type into the glob generic
  portfolioAssetGlobCache = import.meta.glob<{ default: AstroImageMetadata }>(
    "/src/assets/portfolio_alias/*.{jpg,jpeg,png,webp,avif}",
  );

  return portfolioAssetGlobCache;
}

// let htmlCache: Record<string, string> = {};

// export function getHtmlCacheEntry(key: string): string | undefined {
//     return htmlCache[key];
// }

// export function setHtmlCacheEntry(key: string, value: string) {
//     htmlCache[key] = value;
// }
