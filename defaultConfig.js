var _ = require('lodash'),
    pkg = require(process.cwd() + '/package.json');

module.exports = {
  context: {},
  replOptions: {},
  aliases: {
    lodash: '_',
    underscore: '__',
    string: 'S'
  }, // _ has special value in repl
  logger: console.log,
  path: process.cwd(),
  useDependencies: true,
  useDevDependencies: pkg.name === 'replc',
  useColors: true,
  silent: false,
  preprocessor: _.identity,
  dependencies: ['fs', 'lodash', 'moment', 'string', 'co'],
  debugMode: pkg.name === 'replc'
};