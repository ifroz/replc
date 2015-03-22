'use strict';
var repl = require('repl'),
    vm = require('vm'),
    _ = require('lodash'),
    co = require('co'),
    colors = require('colors');

var pkg = require(process.cwd() + '/package.json');

var replEvalFactory = require('./eval');
var renderContext = require('./context');

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
  return startRepl(config, context);
}

function configWithDefaults(yourConfig) {
  return _.assign({}, defaultConfig, pkg.repl, yourConfig);
}

function startRepl(config, context) {
  config.replOptions.eval = replEvalFactory(config);
  config.replOptions.prompt = getPrompt(config);
  var replServer = repl.start(config.replOptions);
  return _.assign(replServer.context, context);
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