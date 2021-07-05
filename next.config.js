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
};
