/**
 * @file
 * @author PaulHan
 * @date 2017/11/13
 */
var webpack = require('webpack');
const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './demo/index.js',
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ["es2015"]
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        'style',
        'css'
        , {publicPath: '../'})
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=512'
    }]
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new ExtractTextPlugin('bundle.css', {allChunks: true}),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, "../packages"),
      "node_modules", // 在启用了alias之后，必须设置，不然找不到
    ],
    alias: {
      "react": 'react',
      'react-dom': 'react-dom',
      'shared': 'shared',
      'fbjs': 'fbjs',
    },
  },
};
