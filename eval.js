'use strict';
var vm = require('vm'),
    highlight = require('ansi-highlight'),
    colors = require('colors');

module.exports = function replEvalFactory(cfg) {
  return function replEval(cmd, ctx, filename, cb) {
    try {
      if (cmd.endsWith('\n') && cmd.length > 1) {
        var res = vm.runInContext(parseEvalInput(ctx, cmd), ctx);
        logSuccess(cfg, cmd, res);
      }
    } catch (e) {
      logCaughtEvalError(cfg, cmd, e);
    } finally {
      return cb(' ');
    }
  };

  function parseEvalInput(cfg, sourceCode) {
    return cfg.preprocessor ? cfg.preprocessor(sourceCode) : sourceCode;
  }
  function logSuccess(cfg, cmd, result) {
    cfg.logger((cfg.useColors ? highlight : _.identity)(result.toString()));
  }
  function logCaughtEvalError(cfg, cmd, e) {
    var red = cfg.useColors ? colors.red : _.identity,
        blue = cfg.useColors ? colors.blue : _.identity,
        grey = cfg.useColors ? colors.grey : _.identity;
    cfg.logger(red('Fail:', e.name));
    cfg.logger(grey(e.message));
    cfg.logger(blue('Stack:'), grey(e.stack.split('^').pop()));
  }
};