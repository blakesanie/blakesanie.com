import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // Enables `next export`
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
