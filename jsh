#!/usr/bin/env node
'use strict';
var _ = require('lodash');
var replc = require('./replc'),
    util = require('./lib/util');
var logIfDebugMode = tapIf(function(obj) {
  return obj.debugMode;
}, console.log);
return _.flow(parseArgs, logIfDebugMode, mapArgs, replc)();

function parseArgs() {
  return require('yargs').
      usage('Usage: jsh --help -ha0dD -r <pkg> -x <pkg> <file-name(s)>').
      describe('all', 'Require all dependencies ' +
        '(for the project in your current working directory).').
      alias('all', 'a').
      describe('0', 'Don\'t require anything unless stated explicitly with -r.').
      describe('require <package>',
        'Require package into context with camel came name').
        alias('r', 'require').
        alias('i', 'require').
        alias('ignore', 'require').
      describe('exclude', 'Exclude package').
        alias('x', 'exclude').
      describe('use-dependencies', 'require package.json dependencies').
        alias('use-dependencies', 'd').
      describe('use-dev-dependencies', 'require devDependencies').
        alias('use-dev-dependencies', 'D').
      describe('last-result', "remap node repl's context._; '$_' by default.").
        alias('last-result', 'l').
      describe('no-color', 'Disable colors').
        alias('no-color', 'C').
      describe('debug-mode', 'Debug verbosity.').
      describe('soft-tabs', 'Pretty print soft tabs, defaults to 2').
      help('help').alias('help', 'h').
      argv;
}

function mapArgs(argv) {
  return _(argv).pick(
      'useDependencies',
      'useDevDependencies',
      'debugMode',
      'softTabs'
    ).assign(requireAllOrNone(), verbosity(), {
      files: argv._,
      dependencies: util.ensureArray(argv.require),
      exclude: util.ensureArray(argv.exclude)
    }).defaults({
      useColors: true,
      softTabs: 2
    }).value();

  function requireAllOrNone() {
    return _(['useDependencies', 'useDevDependencies']).
        zipObject().mapValues(_.constant(argv.all || !argv[0])).value();
  }
  function verbosity() {
    return {
      useColors: !argv.noColor,
      silent: !!argv.silent
    };
  }
}

function tapIf(filterExpr, task) {
  return function runTaskIfFilterExprMatches(tapped) {
    if (_.filter(tapped, filterExpr).length) task(tapped);
    return tapped;
  };
}
