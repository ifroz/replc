'use strict';
var _ = require('lodash'),
    colors = require('colors');
var pkg = require('./pkg');

module.exports = function printWelcomeMessage(cfg, context) {
  var colored = cfg.useColors ? colors.blue : _.identity;
  return cfg.logger(colored(welcomeMessage(context)));

  function welcomeMessage(context) {
    return [
      'Package: ' + pkg.name,
      'Path: ' + process.cwd(),
      'Args: ' + process.argv.slice(2),
      'Last result accessible in: ' + cfg.lastResult,
      'Context: ' + _.keys(context).sort().join(', ')
    ].join('\n');
  }
};