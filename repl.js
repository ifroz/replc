'use strict';
var repl = require('repl');
var _ = require('lodash');
var pkg = require(process.cwd() + '/package.json');
var colors = require('colors');

var defaultConfig = {
  context: { /* custom variables direcly available to the repl */ },
  useDependencies: true,
  useDevDependencies: false,
  dependencies: ['lodash', 'moment', 'string', 'co'],
  aliases: {
    lodash: '_',
    underscore: '_',
    string: 'S'
  },
  replOptions: {
    prompt: pkg.name + '#> '
  },
  silent: false,
  debugMode: pkg.name === 'repl'
};

function tryToRequireAll(packages, aliases, useKeys) {
  return _.reduce(packages, function requirePackages(modules, value, key) {
    var moduleName = useKeys ? key : value;
    try {
      modules[aliases[moduleName] || moduleName] = require(moduleName);
    } catch(e) {}
    return modules;
  }, {});
}

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
  _.assign(ctx, cfg.context);
  return ctx;
}

function getWelcomeString(ctx) {
  return [
    'Package: ' + pkg.name,
    'Path: ' + process.cwd(),
    'Args: ' + process.argv.slice(2),
    'Context: ' + _.keys(ctx).join(', ')
  ].join('\n');
}

module.exports.exampleConfig = defaultConfig;
module.exports = function replicator(inputConfig) {
  var cfg = _.defaults(inputConfig || {}, pkg.repl, defaultConfig);
  var ctx = renderContext(cfg);

  if (!_.isEmpty(ctx) && ! cfg.silent) {
    console.log(colors.blue(getWelcomeString(ctx)));
  }

  var replServer = repl.start(cfg.replOptions);
  _.assign(replServer.context, ctx);
};