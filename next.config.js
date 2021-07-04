module.exports = {
  exportTrailingSlash: true,
  exportPathMap() {
    return {
      "/404.html": { page: "/404" },
    };
  },
};
