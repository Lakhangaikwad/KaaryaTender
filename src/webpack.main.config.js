const TerserPlugin = require("terser-webpack-plugin");

module.exports = () => {
  return {
    mode: "production",
    target: "electron-main",
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
    },
    entry: "./src/main.js",
    module: {
      rules: require("./webpack.rules"),
    },
    plugins: [],
  };
};
