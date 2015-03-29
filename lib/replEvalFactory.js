'use strict';
var _ = require('lodash'),
    vm = require('vm'),
    highlight = require('ansi-highlight'),
    colors = require('colors');
var getPrompt = require('./getPrompt');

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
    try {
      var res = vm.runInContext(parseEvalInput(cmd), ctx);
    } catch (e) {
    } finally {
      (isValidCommand(cmd) ? logSuccess : logHint)(cfg, cmd, res);
    }
    function isValidCommand(cmd) {
      return cmd.endsWith('\n') && cmd.length > 1;
    }
    function parseEvalInput(sourceCode) {
      return cfg.preprocessor ? cfg.preprocessor(sourceCode) : sourceCode;
    }
  }

  function logSuccess(cfg, cmd, result) {
    cfg.logger(ifColors(highlight)((result || 'undefined').toString()));
  }
  function logHint(cfg, cmd, res) {
    process.stdout.write(['',
      colors.green(cmd + ': ') + colors.grey(_.keys(res).join(', ')),
      getPrompt(cfg) + cmd
    ].join('\n'));
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