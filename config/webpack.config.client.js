const path = require("path");
const HTMLWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
function resolve($src) {
  return path.resolve(__dirname, "../src/", $src);
}

const isProd = process.env.NODE_ENV == "production";
module.exports = target => {
  const $output = target
    ? { libraryTarget: "commonjs2" }
    : { library: "commonjs" };

  return {
    mode: isProd ? "production" : "development",
    // devtool: isProd ? "#source-map" : "#cheap-module-source-map",
    entry: {
      app:
        target === "node"
          ? resolve("./client/serverApp.js")
          : resolve("./client/index.js")
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },
    output: {
      filename: target === "node" ? "js/serverApp.js" : "js/[name].js",
      path: resolve("../dist/"),
      publicPath: target ? "/public/" : isProd ? "./" : "/public/",
      ...$output
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
            !target && "style-loader",
            // 别搞这些什么 css module : true
            { loader: "css-loader" },
            {
              loader: "postcss-loader",
              options: {
                // 如果没有options这个选项将会报错 No PostCSS Config found
                plugins: loader => [
                  require("autoprefixer")() //CSS浏览器兼容
                ]
              }
            },
            { loader: "sass-loader" }
          ].filter(Boolean)
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HTMLWebPackPlugin({
        template: path.join(__dirname, "../", "src/client/index.html")
        // filename: `index.html`,
      }),
      new webpack.DefinePlugin({
        __isBrowser: "true"
        // "process.env": require("./" + env + ".env")
      }),

      isProd && new MiniCssExtractPlugin({ filename: "[name].css" }),
      isProd && new UglifyJsPlugin(),
    ].filter(Boolean)
  };
};
