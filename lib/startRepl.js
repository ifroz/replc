'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    vm = require('vm');
var getPrompt = require('./getPrompt');

module.exports = function startRepl(cfg, ctx) {
  cfg.replOptions.eval = require('./eval')(cfg);
  cfg.replOptions.prompt = getPrompt(cfg);

  vm.createContext(ctx);
  var replServer = repl.start(cfg.replOptions);
  _.assign(replServer.context, ctx);
  return replServer;
};