import type { APIRoute } from 'astro';
import { getImage } from "astro:assets";

// Eagerly import all portfolio images to have them in the bundle/manifest
const assetGlob = import.meta.glob(
  "/src/assets/photo-portfolio/temp/**/*.jpg",
  { eager: true }
);

export const GET: APIRoute = async ({ params }) => {
  const { gallery, filename } = params;
  
  if (!gallery || !filename) {
    return new Response('Missing parameters', { status: 400 });
  }

  // Construct the expected internal path
  const assetPath = `/src/assets/photo-portfolio/temp/${gallery}/${filename}.jpg`;
  const asset = assetGlob[assetPath];

  if (!asset) {
    return new Response(`Asset not found: ${assetPath}`, { status: 404 });
  }

  // Process the image using Astro's image service
  const optimized = await getImage({
    src: (asset as any).default,
    width: 1000,
    format: 'webp',
    quality: 75
  });

  const baseUrl = import.meta.env.DEV ? 'http://localhost:4321' : 'https://blakesanie.com';
  return Response.redirect(new URL(optimized.src, baseUrl).toString(), 302);
};

export function getStaticPaths() {
  const paths: any[] = [];
  for (const path of Object.keys(assetGlob)) {
    const parts = path.split('/');
    const filenameWithExt = parts.pop();
    const gallery = parts.pop();
    const filename = filenameWithExt?.split('.').slice(0, -1).join('.');
    
    if (gallery && filename) {
      paths.push({
        params: { gallery, filename }
      });
    }
  }
  return paths;
}
