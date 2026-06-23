import { getImage } from "astro:assets";
import path from "path";
import { encodeEmbeddings } from "./_utils"; // adjust path as needed

// Global memory stores that survive across Astro build iterations
const processedImagesCache = new Map<string, any>();
const optimizedMapImagesCache = new Map<string, any>();

interface ProcessImageParams {
    filePath: string;
    module: any;
    allowClip: boolean;
    allowMetadata: boolean;
    embeddings: any;
    metadata: any;
    resolveCamera: Function;
    resolveLens: Function;
    resolveFocalLength: Function;
    resolveAperture: Function;
    resolveShutter: Function;
}

export async function getSharedProcessedImage({
    filePath,
    module,
    allowClip,
    allowMetadata,
    embeddings,
    metadata,
    resolveCamera,
    resolveLens,
    resolveFocalLength,
    resolveAperture,
    resolveShutter
}: ProcessImageParams) {
    // Unique cache key based on configuration requirements
    const cacheKey = `${filePath}_clip:${allowClip}_meta:${allowMetadata}`;
    if (processedImagesCache.has(cacheKey)) {
        return processedImagesCache.get(cacheKey);
    }

    const filename = path.basename(filePath);
    const name = filename.split(".").slice(0, -1).join(".");
    const width = module.default.width;
    const height = module.default.height;
    const aspectRatioNum = width && height ? width / height : 1;

    // ⚡ Heavy Operation: Resizing/compressing via Astro's image service
    const highRes = await getImage({
        src: module.default,
        width: Math.round(Math.sqrt(2500000 / (height * width)) * width),
        quality: 85,
        format: "webp",
    });

    let out: any = {
        filePath,
        name,
        src: module.default,
        width,
        height,
        highRes: highRes.src,
        aspectRatio: aspectRatioNum,
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
                shutterSpeed: resolveShutter(exif),
                iso: exif.ISO,
                lon: exif.GPSLongitude,
                lat: exif.GPSLatitude,
            };
        }
    }

    processedImagesCache.set(cacheKey, out);
    return out;
}

export async function getSharedMapImage(img: any) {
    if (optimizedMapImagesCache.has(img.filePath)) {
        return optimizedMapImagesCache.get(img.filePath);
    }

    const originalAR = img.width / img.height;
    const targetArea = 4000;
    const h = Math.sqrt(targetArea / originalAR);
    const w = targetArea / h;

    // ⚡ Heavy Operation: Generating map thumbnail images
    const optimized = await getImage({
        src: img.src,
        width: Math.round(w),
        height: Math.round(h),
        format: "webp",
    });

    const result = {
        name: img.name,
        path: optimized.src,
        lat: img.metadata?.lat,
        lon: img.metadata?.lon,
        width: Math.round(w),
        height: Math.round(h),
    };

    optimizedMapImagesCache.set(img.filePath, result);
    return result;
}