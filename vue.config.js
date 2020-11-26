module.exports = {
  chainWebpack: (webpackConfig) => {
    webpackConfig.plugin("html").tap((args) => {
      const [options] = args;
      options.inject = "head";

      return args;
    });
  },

  productionSourceMap: false,
};
