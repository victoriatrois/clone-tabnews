/* eslint-disable no-unused-vars */

const path = require("path");

module.exports = {
  webpack: (config, options) => {
    config.resolve.alias["infra"] = path.join(__dirname, "infra");
    config.resolve.alias["infra/*"] = path.join(__dirname, "infra/*");
    return config;
  },
};
