import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";
import compress from "astro-compress";
import sitemap from "astro-sitemap";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import redirects from "/src/redirects.json";

const noSitemap = new Set(Object.keys(redirects));
// so not in sitemap
noSitemap.add("chicago");
noSitemap.add("lease");
noSitemap.add("public");
noSitemap.add("music");

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
    sitemap({
      filter(page) {
        const routeFirst = page.split("/")[0];
        if (noSitemap.has(routeFirst)) return false;
        if (routeFirst == "photo") {
          const image = page
            .replace("photo/map", "")
            .replace("photo", "")
            .replaceAll("/", "");
          if (image.length) return false;
        }
        return true;
      },
    }),
    compress({
      CSS: {
        csso: {
          comments: false,
          restructure: true,
        },
      },
      HTML: {
        "html-minifier-terser": {
          removeComments: true,
          removeAttributeQuotes: true,
          removeStyleQuotes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          continueOnParseError: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
        },
      },
      JavaScript: {
        terser: {
          compress: true,
          ie8: false,
          keep_classnames: false,
          keep_fnames: false,
          mangle: true,
          toplevel: true,
        },
      },
      SVG: true,
      Image: false,
      // cssOptions: {
      //   preset: "default", // CSS minification preset
      // },
      // htmlOptions: {
      //   collapseWhitespace: true,
      //   removeComments: true,
      //   minifyCSS: true,
      //   minifyJS: true,
      //   removeAttributeQuotes: true,
      // },
      // jsOptions: {
      //   compress: true,
      //   mangle: true, // Shorten variable names
      // },
    }),
  ],
});
