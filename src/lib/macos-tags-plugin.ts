import type { Plugin } from "vite";
import { getMacOSTags } from "./macos-tags";

const imageFilePattern = /\.(png|jpe?g|webp|avif|gif|svg)(?:\?.*)?$/i;

/**
 * Vite registration point for local Finder metadata. The gallery reads the
 * typed metadata service directly, so this plugin never rewrites generated
 * image modules or changes their export shape.
 */
export function macosTagsPlugin(): Plugin {
  return {
    name: "vite-plugin-macos-tags",
    async load(id) {
      if (imageFilePattern.test(id)) await getMacOSTags(id);
      return undefined;
    },
  };
}
