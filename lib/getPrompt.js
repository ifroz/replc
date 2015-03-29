'use strict';
var colors = require('colors');
var pkg = require('./pkg');
module.exports = function getPrompt(cfg) {
  return ifColors(colors.blue)(pkg.name + '#> ');

  function ifColors(thenFn) {
    return cfg.useColors ? thenFn : _.identity;
  }
};
