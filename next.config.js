module.exports = {
  distDir: "_next",
  trailingSlash: true,
  exportPathMap() {
    return {
      "/404.html": { page: "/404" },
      "/index.html": { page: "/" },
    };
  },
};
