const path = require("path");
const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

rules.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-react"],
    },
  },
});

module.exports = {
  mode: "development",
  entry: "./src/renderer/renderer.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.bundle.js",
  },
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
