'use strict';
var _ = require('lodash'),
    pkg = require('./pkg');

var defaultConfig = {
  ctx: {},
  replOptions: {},
  lastResult: '$_', // remap context._
  aliases: { lodash: '_', string: 'S' }, // _ has special value in default repl
  logger: console.log,
  //path: process.cwd(),
  useDependencies: true,
  useDevDependencies: false,
  useColors: true,
  exclude: [],
  silent: false,
  softTabs: 2,
  preprocessor: _.identity,
  dependencies: [],
  debugMode: false
};

module.exports = function configWithDefaults(yourConfig) {
  return _.assign({}, defaultConfig, pkg.repl, yourConfig);
};