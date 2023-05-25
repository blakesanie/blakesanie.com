import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";
import compress from "astro-compress";
import sitemap from "astro-sitemap";
// import vercelStatic from "@astrojs/vercel/static";

// https://astro.build/config
// export default defineConfig({});

// export default {
//   integrations: [astroImageTools],
// };

import redirects from "/src/redirects.json";
const redirectRoutes = new Set(Object.keys(redirects));

export default defineConfig({
  // output: "static",
  // adapter: vercelStatic(),
  site: "https://blakesanie.com",
  integrations: [
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
