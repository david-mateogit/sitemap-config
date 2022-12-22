module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./scripts/sitemap-generator");
    }
    return config;
  },
};
