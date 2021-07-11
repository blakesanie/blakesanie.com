module.exports = {
  trailingSlash: true,
  exportPathMap() {
    return {
      "/404.html": { page: "/404" },
      "/index.html": { page: "/" },
      "/projects": { page: "/projects" },
      "/photo": { page: "/photo" },
      "/photo/gear": { page: "/photo/gear" },
      "/bookmarks": { page: "/bookmarks" },
      "/resume": { page: "/resume" },
    };
  },
  images: {
    domains: ["blakesanie.com", "localhost:3000", "localhost"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: "imgix",
    path: "https://noop/",
  },
};
