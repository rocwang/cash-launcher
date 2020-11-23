module.exports = {
  chainWebpack: webpackConfig => {
    webpackConfig.plugin("html").tap(args => {
      const [options] = args;
      options.inject = "head";

      return args;
    });

    webpackConfig.plugin("preload").tap(args => {
      const [options] = args;
      options.include = "allAssets";
      options.as = entry => {
        if (/\.css$/.test(entry)) return "style";
        if (/\.woff2$/.test(entry)) return "font";
        if (/\.(webp|svg)$/.test(entry)) return "image";

        return "script";
      };

      return args;
    });
  },

  productionSourceMap: false,
};
