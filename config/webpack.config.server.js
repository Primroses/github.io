const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
function resolve($src) {
  return path.resolve(__dirname, "../src/", $src);
}

const isProd = process.env.NODE_ENV == "production";

module.exports = {
  target: "node",
  mode: isProd ? "production" : "development",
  entry: {
    app: resolve("./client/serverApp.js")
  },
  output: {
    filename: "js/serverApp.js",
    path: resolve("../dist/"),
    publicPath: "",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss|sass)$/,
        exclude: /node_modules/,
        use: [
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser: "false"
      // "process.env": require("./" + env + ".env")
    }),

    isProd && new MiniCssExtractPlugin({ filename: "[name].css" }),

    isProd && new UglifyJsPlugin()
  ].filter(Boolean)
};
