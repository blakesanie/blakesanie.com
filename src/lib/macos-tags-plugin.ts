import type { Plugin } from "vite";
import { getMacOSTags } from "./macos-tags";

const imageFilePattern = /\.(png|jpe?g|webp|avif|gif|svg)(?:\?.*)?$/i;

/**
 * Add Finder tags to Vite's generated image module while the source file is
 * transformed. Consumers can then use the tags without any filesystem work.
 */
export function macosTagsPlugin(): Plugin {
  return {
    name: "vite-plugin-macos-tags",
    enforce: "post",
    async transform(code: string, id: string) {
      if (!imageFilePattern.test(id)) return null;

      const tags = await getMacOSTags(id);
      if (tags.length === 0 || code.includes("export const macosTags")) return null;

      // Keep Vite and Astro's default export entirely untouched. A named
      // export also works for every Vite asset module shape, including ones
      // whose default export is not a mutable object.
      return {
        code: `${code}\nexport const macosTags = ${JSON.stringify(tags)};\n`,
        map: null,
      };
    },
  };
}
