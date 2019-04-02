const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DuplicatesPlugin } = require('inspectpack/plugin');

module.exports = {
  devtool: 'inline-source-map',
  target: 'web',
  entry: './test/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'test'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@kemsu')
        ],
        loader: 'babel-loader',
        options: JSON.parse(fs.readFileSync('.babelrc'))
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'form',
      template: './test/index.html'
    }),
    new DuplicatesPlugin({})
  ],

  optimization: {
    namedChunks: true,
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  devServer: {
    port: 3000
  }
};