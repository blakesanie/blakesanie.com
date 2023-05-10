import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";
import vercelStatic from "@astrojs/vercel/static";

// https://astro.build/config
// export default defineConfig({});

// export default {

// integrations: [astroImageTools],
// };

export default defineConfig({
  output: "server",
  adapter: vercelStatic(),
  integrations: [astroImageTools],
});
