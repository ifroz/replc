'use strict';
var _ = require('lodash'),
    colors = require('colors');
var pkg = require(process.cwd() + '/package.json');
module.exports = function printWelcomeMessage(cfg, context) {
  var colored = cfg.useColors ? colors.blue : _.identity;
  cfg.logger(colored(getWelcomeMessage(context)));
};

function getWelcomeMessage(context) {
  return [
    'Package: ' + pkg.name,
    'Path: ' + process.cwd(),
    'Args: ' + process.argv.slice(2),
    'Context: ' + _.keys(context).sort().join(', ')
  ].join('\n');
}
