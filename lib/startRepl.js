'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    colors = require('colors'),
    vm = require('vm');
var replEvalFactory = require('./replEvalFactory'),
    getPrompt = require('./getPrompt');
var pkg = require('./pkg');

module.exports = function startRepl(cfg, ctx) {
  cfg.replOptions.eval = replEvalFactory(cfg);
  cfg.replOptions.prompt = getPrompt(cfg);

  vm.createContext(ctx);
  var replServer = repl.start(cfg.replOptions);
  _.assign(replServer.context, ctx);
  return replServer;
};