'use strict';
var repl = require('repl'),
    vm = require('vm'),
    _ = require('lodash'),
    colors = require('colors');
var pkg = require(process.cwd() + '/package.json');

var defaultConfig = {
  context: {
    log: console.log
  },
  logger: console.log,
  path: process.cwd(),
  useDependencies: true,
  useDevDependencies: pkg.name === 'replc',
  useColors: true,
  silent: false,
  dependencies: ['fs', 'lodash', 'moment', 'string', 'co'],
  aliases: {
    lodash: '__',
    underscore: '__',
    string: 'S'
  }, // _ has special value in repl
  replOptions: {
    prompt: pkg.name + '#> '
  },
  debugMode: pkg.name === 'replc'
};

function replc(inputConfig) {
  var config = configWithDefaults(inputConfig);
  var context = renderContext(config);

  getPrinter(config)(getWelcomeMessage(context));

  config.replOptions.eval = replEval;
  var replServer = repl.start(config.replOptions);
  return _.assign(replServer.context, context);
}

function configWithDefaults(yourConfig) {
  return _.assign({}, yourConfig, pkg.repl, defaultConfig);
}

function replEval(cmd, ctx, filename, cb) {
  try {
    var result = vm.runInContext(cmd, ctx);
    ctx._0 = result;
    console.log(colors.green(cmd));
    cb(null, result);
  } catch (e) {
    console.log([
      colors.red(e),
      colors.grey(e.stack),
      colors.blue(':(')
    ].join('\n'));
    cb(null);
  }
}

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
  return _.assign(ctx, cfg.context);
}

function tryToRequireAll(packages, aliases, useKeys) {
  useKeys = useKeys !== undefined ? useKeys : _.isObject(useKeys);
  return _.reduce(packages, function requirePackage(modules, value, key) {
    var moduleName = useKeys ? key : value;
    try {
      modules[aliases[moduleName] || moduleName] = require(moduleName);
    } catch(e) {}
    return modules;
  }, {});
}

function getPrinter(cfg, color) {
  if (cfg.silent) return _.noop;
  return cfg.useColors ? _.flow(colors[color || 'blue'], cfg.logger) : cfg.logger;
}
function getWelcomeMessage(context) {
  return [
    'Package: ' + pkg.name,
    'Path: ' + process.cwd(),
    'Args: ' + process.argv.slice(2),
    'Context: ' + _.keys(context).join(', ')
  ].join('\n');
}

if (_.contains(process.argv, '--replc')) {
  replc();
}
module.exports = replc;