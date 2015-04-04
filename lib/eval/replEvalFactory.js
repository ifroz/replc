'use strict';
var _ = require('lodash'),
    vm = require('vm'),
    highlight = require('ansi-highlight'),
    colors = require('colors');
var getPrompt = require('./../getPrompt');

module.exports = function replEvalFactory(cfg) {
  return function replEval(cmd, ctx, filename, cb) {
    try {
      evalAndLogIfValid(cmd, ctx)
    } catch (e) {
      logCaughtEvalError(cmd, e);
    } finally {
      return cb(' ');
    }
  };

  function evalAndLogIfValid(cmd, ctx) {
    try {
      var res = vm.runInContext(parseEvalInput(cmd), ctx);
    } catch (e) {
    } finally {
      (isValidCommand(cmd) ? writeSuccess : writeHint)(cmd, res);
    }
    function isValidCommand(cmd) {
      return cmd.endsWith('\n') && cmd.length > 1;
    }
    function parseEvalInput(sourceCode) {
      return cfg.preprocessor ? cfg.preprocessor(sourceCode) : sourceCode;
    }
  }

  function writeSuccess(cmd, res) {
    process.stdout.write(
        ifColors(highlight)((res || 'undefined').toString()) + '\n');
  }
  function writeHint(cmd, res) {
    process.stdout.write(['\n' +
      colors.green(cmd + ': ') + colors.grey(_.keys(res).join(', '))]);
  }
  function logCaughtEvalError(cmd, e) {
    cfg.logger(ifColors(colors.red)(cmd);
    cfg.logger(ifColors(colors.red)('Fail:', e.name));
    cfg.logger(ifColors(colors.grey)(e.message));
    cfg.logger(ifColors(colors.blue)('Stack:'),
        ifColors(colors.grey)(e.stack.split('^').pop()));
  }
  function ifColors(thenFn) {
    return cfg.useColors ? thenFn : _.identity;
  }
};