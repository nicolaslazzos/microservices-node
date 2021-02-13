const withImages = require("next-images");

module.exports = withImages({
  webpackMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  }
});
