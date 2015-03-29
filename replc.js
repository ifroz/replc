'use strict';
var _ = require('lodash');
var configWithDefaults = require('./lib/configWithDefaults'),
    renderContext = require('./lib/renderContext'),
    printWelcomeMessage = require('./lib/printWelcomeMessage'),
    startRepl = require('./lib/startRepl');

function replc(inputConfig) {
  var cfg = configWithDefaults(inputConfig);
  var ctx = renderContext(cfg);
  printWelcomeMessage(cfg, ctx);
  return startRepl(cfg, ctx);
}

if (_.contains(process.argv, '--replc')) {
  replc({ ctx: { json: JSON.parse } });
}
module.exports = replc;