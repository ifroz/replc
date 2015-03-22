'use strict';
var repl = require('repl'),
    vm = require('vm'),
    _ = require('lodash'),
    co = require('co'),
    humps = require('humps'),
    colors = require('colors'),
    highlight = require('ansi-highlight');
var pkg = require(process.cwd() + '/package.json');

var defaultConfig = {
  context: { log: console.log },
  logger: console.log,
  path: process.cwd(),
  useDependencies: true,
  useDevDependencies: pkg.name === 'replc',
  useColors: true,
  silent: false,
  preprocessor: _.identity,
  dependencies: ['fs', 'lodash', 'moment', 'string', 'co'],
  aliases: { lodash: '__',  underscore: '__', string: 'S' }, // _ has special value in repl
  replOptions: {},
  debugMode: pkg.name === 'replc',
  debug: _.flow(colors.red, _.partial(console.log, 'DEBUG: '))
};

function replc(inputConfig) {
  var config = configWithDefaults(inputConfig);
  var context = renderContext(config);
  getLogger(config, 'blue')(getWelcomeMessage(context));

  config.replOptions.eval = replEvalFactory(config);
  config.replOptions.prompt = getPrompt(config);
  var replServer = repl.start(config.replOptions);
  return _.assign(replServer.context, context);
}

function configWithDefaults(yourConfig) {
  return _.assign({}, defaultConfig, pkg.repl, yourConfig);
}

function replEvalFactory(cfg) {
  return function replEval(cmd, ctx, filename, cb) {
    try {
      if (cmd.endsWith('\n') && cmd.length > 1) {
        var res = vm.runInContext(parseEvalInput(ctx, cmd), ctx);
        logSuccess(cfg, cmd, res);
      }
    } catch (e) {
      logCaughtEvalError(cfg, cmd, e);
    } finally {
      return cb(' ');
    }
  };
}

function parseEvalInput(cfg, sourceCode) {
  return cfg.preprocessor ? cfg.preprocessor(sourceCode) : sourceCode;
}

function logSuccess(cfg, cmd, result) {
  var green = cfg.useColors ? colors.green : _.identity;
  var highlighted = cfg.useColors ? highlight : _.identity;
  cfg.logger(green('Success:'), cmd.trim('\n'));
  cfg.logger(green('Result:\n'), highlighted(result.toString()));
}
function logCaughtEvalError(cfg, cmd, e) {
  var red = cfg.useColors ? colors.red : _.identity,
      grey = cfg.useColors ? colors.grey : _.identity;
  cfg.logger(red('Fail: ' + cmd.trim('\n')));
  cfg.logger(red(e.name + ':', e.message));
  cfg.logger(grey(e.stack));
}

function renderContext(cfg) {
  var ctx = tryToRequireAll(cfg.dependencies, cfg.aliases);
  if (cfg.useDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.dependencies, cfg.aliases)); }
  if (cfg.useDevDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.devDependencies, cfg.aliases)); }
  if (cfg.debugMode) {
    ctx._cfg = cfg; }
  return _.assign(ctx, cfg.context);
}
function tryToRequireAll(packages, aliases, useKeys) {
  useKeys = useKeys !== undefined ? useKeys : ! _.isArray(packages);
  var packageNames = useKeys ? _.keys(packages) : packages;
  return reduceRequire(getFormattedPackages(packageNames, aliases));
}
function getFormattedPackages(packageNames, aliases) {
  return _.reduce(packageNames, function formatPkg(formatted, pkgName) {
    var key = aliases[pkgName] || pkgName;
    formatted[aliases[pkgName] || humps.camelize(key)] = pkgName;
    return formatted;
  }, {});
}
function reduceRequire(formattedPackages) {
  return _.reduce(formattedPackages, function requirePkg(ctx, pkgName, ctxName) {
    ctx[ctxName] = require(pkgName);
    return ctx;
  }, {});
}

function getLogger(cfg, color) {
  if (cfg.silent) return _.noop;
  if (cfg.useColors && color) return _.flow(colors[color], cfg.logger);
  return cfg.logger;
}
function getWelcomeMessage(context) {
  return [
    'Package: ' + pkg.name,
    'Path: ' + process.cwd(),
    'Args: ' + process.argv.slice(2),
    'Context: ' + _.keys(context).join(', ')
  ].join('\n');
}
function getPrompt(cfg) {
  return (cfg.useColors ? colors.blue : _.identity)(pkg.name + '#> ');
}

if (_.contains(process.argv, '--replc')) {
  replc();
}
module.exports = replc;