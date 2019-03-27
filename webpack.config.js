//const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "inline-source-map",
  target: "web",
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        //options: JSON.parse(fs.readFileSync(".babelrc"))
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "form",
      template: "./src/index.html"
    })
  ],

  optimization: {
    namedChunks: true,
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },

  devServer: {
    port: 3000
  }
};