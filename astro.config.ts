import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "astro-sitemap";
import type { AstroIntegration } from "astro";
import { unlink, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { astroImagePipelinePlugin } from "vite-image-pipeline";
import { macosTagsPlugin } from "./src/lib/macos-tags-plugin";
import { shouldIncludeSitemapRoute } from "./src/lib/sitemap";

function deleteOriginalJpegs(): AstroIntegration {
  return {
    name: "delete-original-jpegs",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const astroAssetsDir = join(fileURLToPath(dir), "_astro");
        let files: string[];
        try {
          files = await readdir(astroAssetsDir);
        } catch {
          return;
        }

        const originals = files.filter((file) => /\.(jpg|jpeg)$/i.test(file));
        await Promise.all(originals.map((file) => unlink(join(astroAssetsDir, file))));
      },
    },
  };
}

export default defineConfig({
  output: "static",
  site: "https://blakesanie.com",
  vite: {
    plugins: [macosTagsPlugin()],
  },
  integrations: [
    astroImagePipelinePlugin(),
    sitemap({ filter: shouldIncludeSitemapRoute }),
    icon(),
    deleteOriginalJpegs(),
  ],
});
