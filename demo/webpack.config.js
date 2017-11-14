/**
 * @file
 * @author PaulHan
 * @date 2017/11/13
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './demo/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015']
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
    }, {
      test: /\.js$/, // react,fbjs使用rollup替换，这里使用webpack方案
      include: [path.resolve(__dirname, '../packages/')],
      loader: 'string-replace-loader',
      query: {
        search: '__DEV__',
        replace: 'true',
        flags: 'g'
      }
    }]
  },
  devtool: "cheap-module-source-map",
  plugins: [
    // new ExtractTextPlugin('bundle.css', {allChunks: true}),
    // new webpack.DefinePlugin({ // 未编译的react不会使用它
    //   'process.env.NODE_ENV': '"development"',
    // }),
    new HtmlWebpackPlugin({
      title: 'Hello App',
      template: path.resolve(__dirname, 'index.html')
    }),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, '../packages'),
      'node_modules', // 在启用了alias之后，必须设置，不然找不到
    ],
    alias: {
      "react": 'react',
      'react-dom': 'react-dom',
      'shared': 'shared',
      'fbjs': 'fbjs', // 重定向fbjs的位置
    },
  },
};
