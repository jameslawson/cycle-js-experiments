/**
 * @description Configuration for Webpack
 * Configuration Documentation: https://webpack.github.io/docs/configuration.html
 */

module.exports = {
  context: __dirname + '/../src',
  devtool: 'inline-source-map',
  entry: './index.js',
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      test: /\.js$/,
    }]
  },
  output: {
    filename: 'webpack-bundle.js',
    path: __dirname + '/../dist'
  }
};
