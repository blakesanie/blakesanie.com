import { defineConfig } from "astro/config";
import compress from "astro-compress";
import sitemap from "astro-sitemap";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import redirects from "/src/redirects.json";
import icon from "astro-icon";
import imagePipeline from "astro-image-pipeline";

const noSitemap = new Set(Object.keys(redirects));
// so not in sitemap
noSitemap.add("chicago");
noSitemap.add("lease");
noSitemap.add("public");
noSitemap.add("music");
noSitemap.add("resume-raw");
noSitemap.add("401k");

// https://astro.build/config
export default defineConfig({
  output: "static",
  // adapter: vercelStatic(),
  site: "https://blakesanie.com",
  integrations: [
    imagePipeline(),
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
    icon(),
  ],
});
