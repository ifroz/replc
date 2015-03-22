'use strict';
var _ = require('lodash');
var configWithDefaults = require('./lib/configWithDefaults'),
    renderContext = require('./lib/renderContext'),
    startRepl = require('./lib/startRepl'),
    printWelcomeMessage = require('./lib/printWelcomeMessage');

function replc(inputConfig) {
  var cfg = configWithDefaults(inputConfig);
  var ctx = renderContext(cfg);
  printWelcomeMessage(cfg, ctx);
  return startRepl(cfg, ctx);
}

if (_.contains(process.argv, '--replc')) {
  repl({ ctx: { json: JSON.parse } });
}
module.exports = replc;