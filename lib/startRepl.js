'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    colors = require('colors');
var replEvalFactory = require('./replEvalFactory');
var pkg = require('./pkg');

module.exports = function startRepl(config, context) {
  config.replOptions.eval = replEvalFactory(config);
  config.replOptions.prompt = getPrompt(config);

  var replServer = repl.start(config.replOptions);
  _.assign(replServer.context, context);
  return replServer;

  function getPrompt() {
    return ifColors(colors.blue)(pkg.name + '#> ');
  }
  function ifColors(thenFn) {
    return config.useColors ? thenFn : _.identity;
  }
};