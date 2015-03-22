'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    colors = require('colors');
var replEvalFactory = require('./replEvalFactory');
var pkg = require(process.cwd() + '/package.json');

module.exports = function startRepl(config, context) {
  config.replOptions.eval = replEvalFactory(config);
  config.replOptions.prompt = getPrompt(config);

  var replServer = repl.start(config.replOptions);
  return _.assign(replServer.context, context);

  function getPrompt() {
    return ifColors(colors.blue)(pkg.name + '#> ');
  }
  function ifColors(thenFn) {
    return config.useColors ? thenFn : _.identity;
  }
};