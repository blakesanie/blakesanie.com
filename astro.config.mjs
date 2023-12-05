import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";
import compress from "astro-compress";
import sitemap from "astro-sitemap";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// import vercelStatic from "@astrojs/vercel/static";

// https://astro.build/config
// export default defineConfig({});

// export default {
//   integrations: [astroImageTools],
// };

import redirects from "/src/redirects.json";
const redirectRoutes = new Set(Object.keys(redirects));
redirectRoutes.add("chicago");

export default defineConfig({
  // output: "static",
  // adapter: vercelStatic(),
  site: "https://blakesanie.com",
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "github-light",
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      lineNumbers: true,
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      gfm: true,
    }),
    astroImageTools,
    compress({
      img: false,
    }),
    sitemap({
      filter(page) {
        const routeFirst = page.split("/")[0];
        if (redirectRoutes.has(routeFirst)) return false;
        return true;
      },
    }),
  ],
});
