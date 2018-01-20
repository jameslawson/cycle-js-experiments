/* eslint-disable */
/*
 * From installation instructions for karma-webpack
 * @see https://github.com/webpack/karma-webpack
 */
var context = require.context('.', true, /\.spec\.js$/);
context.keys().forEach(context);

var chaiIncreasing = require('chai-increasing');
var chaiImmutable = require('chai-immutable');
var snabbdomChai = require('snabbdom-chai');
var sinonChai = require('sinon-chai');
chai.use(chaiIncreasing);
chai.use(chaiImmutable);
chai.use(snabbdomChai);
chai.use(sinonChai);
