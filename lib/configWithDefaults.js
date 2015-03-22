'use strict';
var _ = require('lodash'),
    pkg = require(process.cwd() + '/package.json');

var defaultConfig = {
  context: {},
  replOptions: {},
  aliases: { lodash: '_', string: 'S' }, // _ has special value in repl
  logger: console.log,
  //path: process.cwd(),
  useDependencies: true,
  useDevDependencies: pkg.name === 'replc',
  useColors: true,
  silent: false,
  softTabs: 2,
  preprocessor: _.identity,
  dependencies: ['fs', 'lodash', 'moment', 'string', 'co'],
  debugMode: pkg.name === 'replc'
};

module.exports = function configWithDefaults(yourConfig) {
  return _.assign({}, defaultConfig, pkg.repl, yourConfig);
};
