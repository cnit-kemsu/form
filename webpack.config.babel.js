import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',

  entry: './example/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          'node_modules/@kemsu',
          'src',
          'example'
        ].map(incl => path.resolve(__dirname, incl)),
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html'
    })
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

  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/')
    }
  },

  devServer: {
    port: 3000,
    historyApiFallback: true
  }
};