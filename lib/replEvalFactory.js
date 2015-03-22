'use strict';
var _ = require('lodash'),
    vm = require('vm'),
    highlight = require('ansi-highlight'),
    colors = require('colors');

module.exports = function replEvalFactory(cfg) {
  return function replEval(cmd, ctx, filename, cb) {
    try {
      evalAndLogIfValid(cmd, ctx)
    } catch (e) {
      logCaughtEvalError(cfg, cmd, e);
    } finally {
      return cb(' ');
    }
  };

  function evalAndLogIfValid(cmd, ctx) {
    if (isValidCommand(cmd)) {
      var res = vm.runInContext(parseEvalInput(ctx, cmd), ctx);
      logSuccess(cfg, cmd, res);
    }
    function isValidCommand(cmd) {
      return cmd.endsWith('\n') && cmd.length > 1;
    }
    function parseEvalInput(cfg, sourceCode) {
      return cfg.preprocessor ? cfg.preprocessor(sourceCode) : sourceCode;
    }
  }
  function logSuccess(cfg, cmd, result) {
    cfg.logger(ifColors(highlight)((result || 'undefined').toString()));
  }
  function logCaughtEvalError(cfg, cmd, e) {
    cfg.logger(ifColors(colors.red)('Fail:', e.name));
    cfg.logger(ifColors(colors.grey)(e.message));
    cfg.logger(ifColors(colors.blue)('Stack:'),
        ifColors(colors.grey)(e.stack.split('^').pop()));
  }
  function ifColors(thenFn) {
    return cfg.useColors ? thenFn : _.identity;
  }
};