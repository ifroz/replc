'use strict';
var _ = require('lodash'),
    repl = require('repl'),
    colors = require('colors');
var pkg = require(process.cwd() + '/package.json');

var defaultConfig = {
  context: { log: console.log },
  useDependencies: true,
  useDevDependencies: pkg.name === 'repl',
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
  debugMode: pkg.name === 'repl'
};

function renderContext(cfg) {
  var ctx = tryToRequireAll(cfg.dependencies, cfg.aliases);
  if (cfg.useDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.dependencies, cfg.aliases, true));
  }
  if (cfg.useDevDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.devDependencies, cfg.aliases, true));
  }
  if (cfg.debugMode) {
    ctx._cfg = cfg;
  }
  return _.assign(ctx, cfg.context);
}

function tryToRequireAll(packages, aliases, useKeys) {
  return _.reduce(packages, function requirePackages(modules, value, key) {
    var moduleName = useKeys ? key : value;
    try {
      modules[aliases[moduleName] || moduleName] = require(moduleName);
    } catch(e) {}
    return modules;
  }, {});
}

function getWelcomeString(ctx) {
  return [
    'Package: ' + pkg.name,
    'Path: ' + process.cwd(),
    'Args: ' + process.argv.slice(2),
    'Context: ' + _.keys(ctx).join(', ')
  ].join('\n');
}

module.exports = function replc(inputConfig) {
  var cfg = _.defaults(inputConfig || {}, pkg.repl, defaultConfig);
  var ctx = renderContext(cfg);

  if (!_.isEmpty(ctx) && ! cfg.silent) {
    var print = cfg.useColors ? _.flow(colors.blue, console.log) : console.log;
    print(getWelcomeString(ctx));
  }

  var replServer = repl.start(cfg.replOptions);
  return _.assign(replServer, {context: ctx});
};

