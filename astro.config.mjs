import { defineConfig } from "astro/config";
import compress from "astro-compress";
import sitemap from "astro-sitemap";
import redirects from "/src/redirects.json";
import icon from "astro-icon";
import { astroImagePipelinePlugin } from "vite-image-pipeline";
import path from "path"
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const noSitemap = new Set(Object.keys(redirects));
// so not in sitemap
noSitemap.add("chicago");
noSitemap.add("lease");
noSitemap.add("public");
noSitemap.add("music");
noSitemap.add("resume-raw");
noSitemap.add("401k");

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
    compress({
      CSS: {
        csso: {
          comments: false,
          restructure: true,       // Safe: Merges duplicate CSS selectors and rules
          forceMediaMerge: true,   // Safe: Combines matching @media queries
        },
      },
      HTML: {
        "html-minifier-terser": {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          removeComments: true,
          removeAttributeQuotes: true,        // Safe: Drops quotes only where HTML5 spec allows
          removeStyleQuotes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: false,         // CHANGED TO FALSE: Keeps <html>/<body> tags to prevent parsing bugs
          removeRedundantAttributes: true,   // Safe: Removes defaults like type="text"
          removeEmptyAttributes: true,
          decodeEntities: true,              // Safe: Uses direct UTF-8 characters
          minifyCSS: true,
          minifyJS: true,
          sortAttributes: true,              // Safe: Boosts Gzip/Brotli compression ratios
          sortClassName: true,               // Safe: Alphabetizes utility classes for better compression
        },
      },
      JavaScript: {
        terser: {
          ecma: 2020,
          compress: {
            passes: 3,                       // Safe: 3 passes catches nested dead code without syntax corruption
            dead_code: true,
            unused: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            sequences: true,
            unsafe_arrows: true,             // Safe: Converts standard anonymous functions to arrow functions
            drop_console: true,              // Safe: Removes console.logs
            drop_debugger: true,
          },
          mangle: {
            toplevel: true,                  // Safe: Mangles local/global variables, leaves object properties untouched
          },
          format: {
            comments: false,                 // Safe: Purges all comments, including legal headers
          },
          toplevel: true,
        },
      },
      SVG: {
        multipass: true,                     // Safe: Loops SVGO to strip redundant vector metadata
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: { floatPrecision: 3 }, // CHANGED TO 3: Prevents distortion of complex vector shapes
                convertPathData: { floatPrecision: 3 },
                removeViewBox: false,                       // Prevents SVG scaling bugs
              },
            },
          },
        ],
      },
      Image: false,
    }),
    icon(),
    deleteOriginalJpegs(),
  ],
});
