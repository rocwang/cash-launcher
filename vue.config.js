const os = require("os");
const fs = require("fs");

module.exports = {
  configureWebpack: {
    output: {
      filename: "js/[name].[hash:8].js",
      chunkFilename: "js/[name].[hash:8].js",
    },
  },
  chainWebpack: (webpackConfig) => {
    webpackConfig.plugin("html").tap((args) => {
      const [options] = args;
      options.inject = "head";

      return args;
    });
  },

  productionSourceMap: false,

  devServer: {
    host: "home.kiwiberry.nz",
    port: "3333",
    https:
      process.env.NODE_ENV === "development"
        ? {
            key: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.key"),
            cert: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.crt"),
          }
        : false,
  },
};
