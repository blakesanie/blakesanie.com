import { defineConfig } from "astro/config";
import compress from "astro-compress";
import sitemap from "astro-sitemap";
import redirects from "/src/redirects.json";
import icon from "astro-icon";
import { astroImagePipelinePlugin } from "vite-image-pipeline";
import path from "path"
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process'; // Added missing import
import { promisify } from 'node:util';         // Added missing import
const execFileAsync = promisify(execFile);

const noSitemap = new Set(Object.keys(redirects));
// so not in sitemap
noSitemap.add("chicago");
noSitemap.add("lease");
noSitemap.add("public");
noSitemap.add("music");
noSitemap.add("resume-raw");
noSitemap.add("401k");

async function getMacOSTags(filePath) {
  try {
    // 1. Strip Vite query parameters AND '/@fs' prefix
    let cleanPath = decodeURIComponent(filePath.split('?')[0]);
    if (cleanPath.startsWith('/@fs/')) {
      cleanPath = cleanPath.slice(4); // '/@fs/Users/...' -> '/Users/...'
    }

    // 2. Omit '-raw' for a clean, structured output
    const { stdout } = await execFileAsync('mdls', [
      '-name',
      'kMDItemUserTags',
      cleanPath,
    ]);

    if (!stdout || stdout.includes('(null)')) {
      return [];
    }

    // 3. Parse lines between '(' and ')'
    const lines = stdout.split('\n');
    const tags = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip array brackets and header
      if (!trimmed || trimmed.startsWith('kMDItemUserTags') || trimmed === '(' || trimmed === ')') {
        continue;
      }

      // Clean up commas, quotes, and color code suffixes (e.g. "Red\n6")
      const tag = trimmed
        .replace(/,$/, '')              // Remove trailing comma
        .replace(/^"|"$/g, '')          // Strip surrounding quotes
        .replace(/\\n\d+$/, '')         // Strip color ID suffix if present
        .trim();

      if (tag) tags.push(tag);
    }

    return tags;
  } catch (err) {
    return [];
  }
}

// Vite Plugin definition
function macosTagsPlugin() {
  return {
    name: 'vite-plugin-macos-tags',
    enforce: 'post', // Run AFTER Astro / image pipeline builds the default object
    async transform(code, id) {
      if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(id)) {
        const filePath = decodeURIComponent(id.split('?')[0]);
        const tags = await getMacOSTags(filePath);
        const tagsJson = JSON.stringify(tags);

        // Attach macosTags directly onto the 'export default' object
        if (code.includes('export default')) {
          const updatedCode = code.replace(
            /export default\s+([\s\S]+?);?$/,
            `const _img = $1;\n_img.macosTags = ${tagsJson};\nexport default _img;\nexport const macosTags = ${tagsJson};`
          );
          return { code: updatedCode, map: null };
        }

        return {
          code: `${code}\nexport const macosTags = ${tagsJson};`,
          map: null,
        };
      }
    },
  };
}

const deleteOriginalJpegs = () => ({
  name: 'delete-original-jpegs',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      // dir is a URL object pointing to your /dist folder
      const astroAssetsDir = path.join(fileURLToPath(dir), '_astro');

      if (!fs.existsSync(astroAssetsDir)) return;

      const files = fs.readdirSync(astroAssetsDir);
      let count = 0;

      for (const file of files) {
        // Match both .jpg and .jpeg files
        if (/\.(jpg|jpeg)$/i.test(file)) {
          fs.unlinkSync(path.join(astroAssetsDir, file));
          count++;
        }
      }

      if (count > 0) {
        console.log(`\x1b[36m[cleanup]\x1b[0m Successfully removed ${count} original high-res JPEG(s) from dist/_astro/`);
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  output: "static",
  // adapter: vercelStatic(),
  site: "https://blakesanie.com",
  vite: {
    plugins: [macosTagsPlugin()], //  Vite plugins belong inside vite.plugins
  },
  integrations: [
    astroImagePipelinePlugin(),
    // mdx({
    //   remarkPlugins: [remarkMath],
    //   rehypePlugins: [rehypeKatex],
    //   gfm: true,
    // }),
    sitemap({
      filter(page) {
        let parts = page.split("/");
        if (parts.slice(-1)[0] == "") {
          parts = parts.slice(0, -1);
        }
        const routeFirst = parts[0];
        console.log("sitemap parts", parts);
        if (noSitemap.has(routeFirst)) return false;
        if (routeFirst == "photo") {
          const albumsIndex = parts.indexOf("albums");
          if (albumsIndex >= 0) {
            if (albumsIndex < parts.length - 2) return false;
          } else {
            console.log("sitemap page", page);
            const image = page
              .replace("photo/map", "")
              .replace("photo", "")
              .replaceAll("/", "");
            if (image.length) return false;
          }
        }
        return true;
      },
    }),
    icon(),
    deleteOriginalJpegs(),
  ],
});
