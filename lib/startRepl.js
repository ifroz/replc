'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    fs = require('fs'),
    vm = require('vm');
var getPrompt = require('./getPrompt'),
    util = require('./util');

module.exports = function startRepl(cfg, ctx) {
  cfg.replOptions.eval = require('./eval')(cfg);
  cfg.replOptions.prompt = getPrompt(cfg);

  vm.createContext(ctx);

  _.each(util.ensureArray(cfg.files), function evaluateFile(f) {
    vm.runInContext('module = {};', ctx);
    if (fs.existsSync(f))
      var script = fs.readFileSync(f, 'utf-8');
      vm.runInContext(script, ctx);
  });
  var replServer = repl.start(cfg.replOptions);
  _.assign(replServer.context, ctx);
  return replServer;
};