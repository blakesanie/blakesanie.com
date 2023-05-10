import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";
import compress from "astro-compress";
// import vercelStatic from "@astrojs/vercel/static";

// https://astro.build/config
// export default defineConfig({});

// export default {
//   integrations: [astroImageTools],
// };

export default defineConfig({
  // output: "static",
  // adapter: vercelStatic(),
  integrations: [
    astroImageTools,
    compress({
      img: false,
    }),
  ],
});
