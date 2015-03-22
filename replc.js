'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    colors = require('colors');
var pkg = require(process.cwd() + '/package.json');
console.log(pkg);

var defaultConfig = {
  context: { log: console.log },
  path: process.cwd(),
  useDependencies: true,
  useDevDependencies: pkg.name === 'replc',
  useColors: true,
  silent: false,
  dependencies: ['lodash', 'moment', 'string', 'co'],
  aliases: {
    lodash: '_',
    underscore: '_',
    string: 'S'
  },
  replOptions: {
    prompt: pkg.name + '#> '
  },
  debugMode: pkg.name === 'replc'
};

function replc(inputConfig) {
  var cfg = _.defaults(inputConfig || {}, pkg.repl, defaultConfig);
  var ctx = renderContext(cfg);

  if (!_.isEmpty(ctx) && ! cfg.silent) {
    getPrinter(cfg)(getWelcomeMessage(ctx));
  }

  var replServer = repl.start(cfg.replOptions);
  _.assign(replServer.context, ctx);
}

module.exports = replc;
if (_.contains(process.argv, '--replc')) replc();

function renderContext(cfg) {
  var ctx = tryToRequireAll(cfg.dependencies, cfg.aliases);
  if (cfg.useDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.dependencies, cfg.aliases));
  }
  if (cfg.useDevDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.devDependencies, cfg.aliases));
  }
  if (cfg.debugMode) {
    ctx._cfg = cfg;
  }
  _.assign(ctx, cfg.context);
  return ctx;
}

function tryToRequireAll(packages, aliases, useKeys) {
  useKeys = useKeys !== undefined ? useKeys : _.isObject(useKeys);
  return _.reduce(packages, function requirePackages(modules, value, key) {

    var moduleName = useKeys ? key : value;
    try {
      modules[aliases[moduleName] || moduleName] = require(moduleName);
    } catch(e) {}
    return modules;
  }, {});
}

function getPrinter(cfg) {
  return cfg.useColors ? _.flow(colors.blue, console.log) : console.log;
}

function getWelcomeMessage(ctx) {
  return [
    'Package: ' + pkg.name,
    'Path: ' + process.cwd(),
    'Args: ' + process.argv.slice(2),
    'Context: ' + _.keys(ctx).join(', ')
  ].join('\n');
}

