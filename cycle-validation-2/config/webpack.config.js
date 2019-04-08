const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({ filename: '[name].[contenthash].css' });
const indexPage = new HtmlWebpackPlugin({ template: 'index.html' });

module.exports = {
  context: __dirname + '/../src',
  entry: './index.js',
  output: {
    path: __dirname + '/../dist',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['env'],
        plugins: ['transform-object-rest-spread', 'transform-es2015-destructuring']
      }
    }],
    rules: [{
      test: /\.scss$/,
      use: extractSass.extract({
        use: [
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ],
        fallback: 'style-loader'
      })
    }]
  },
  plugins: [ indexPage, extractSass ]
};

