/**
 * @description Configuration for the Karma test runner.
 * Configuration Documentation: http://karma-runner.github.io/0.13/config/configuration-file.html
 * [1]: Prevents saucelabs disconnection (see http://tinyurl.com/j9tlsna)
 * [2] Karma Frameworks: https://npmjs.org/browse/keyword/karma-adapter
 * [3] Karma Preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
 * [4] Karma Reporters: https://npmjs.org/browse/keyword/karma-reporter
 * [5] Karma Launchers: https://npmjs.org/browse/keyword/karma-launcher
 * [6],[7],[8] From installation instructions: https://github.com/webpack/karma-webpack
 */

var isTravis = process.env.CONTINUOUS_INTEGRATION === 'true'
var build = (isTravis) ? process.env.TRAVIS_BUILD_NUMBER : 'local';

var customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'OS X 10.11',
    version: '35'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
  }
};
module.exports = function(config) {

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }
  config.set({
    basePath: '',
    browserNoActivityTimeout: 45000, // [1]
    browsers: Object.keys(customLaunchers), // [5]
    captureTimeout: 1200000, // [1]
    customLaunchers: customLaunchers,
    colors: true,
    files: [ '../test/driver/spec.helper.js' ],
    frameworks: ['mocha', 'chai', 'sinon'], // [2]
    logLevel: config.LOG_DEBUG,
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-sinon',
      'karma-sauce-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
       require('karma-webpack'), // [6]
    ],
    port: 9876,
    preprocessors: {
      '../test/driver/spec.helper.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'saucelabs'], // [4]
    sauceLabs: {
      testName: 'Pica - Driver Unit Tests',
      build: build,
      recordVideo: true
    },
    singleRun: true,
    webpack: require('./webpack.config.js'), // [6]
    webpackMiddleware: { // [6]
      noInfo: true
    },
    webpackServer: { // [6]
      noInfo: true
    }
  });
};
