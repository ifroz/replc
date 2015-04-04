'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    vm = require('vm'),
    fs = require('fs');
var evalFactory = require('./evalFactory'),
    getPrompt = require('./getPrompt'),
    util = require('./util');

module.exports = function startRepl(cfg, ctx) {
  _.assign(cfg.replOptions, {
    eval: evalFactory(cfg),
    prompt: getPrompt(cfg)
  });

  vm.createContext(ctx);
  _.each(util.ensureArray(cfg.files), evaluateFile);
  var replServer = repl.start(cfg.replOptions);
  _.assign(replServer.context, ctx);
  return replServer;

  function evaluateFile(f) {
    if (fs.existsSync(f)) {
      vm.runInContext([
        'module = {};',
        fs.readFileSync(f, 'utf-8')
      ].join('\n'), ctx);
    }
  }
};