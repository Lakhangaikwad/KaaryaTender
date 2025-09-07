const rules = require("./webpack.rules");
const TerserPlugin = require("terser-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: ["style-loader", "css-loader"],
});

module.exports = {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  module: {
    rules,
  },
  performance: {
    hints: false,
  },
};
