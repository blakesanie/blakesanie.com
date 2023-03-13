import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";

// https://astro.build/config
// export default defineConfig({});

export default {
  integrations: [astroImageTools],
};
