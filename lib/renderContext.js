'use strict';
var _ = require('lodash'),
    humps = require('humps');
var pkg = require(process.cwd() + '/package.json');

module.exports = function renderContext(cfg) {
  var ctx = tryToRequireAll(cfg.dependencies, cfg.aliases);
  if (cfg.useDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.dependencies, cfg.aliases)); }
  if (cfg.useDevDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.devDependencies, cfg.aliases)); }
  if (cfg.debugMode) {
    ctx._cfg = cfg; }
  return _.assign(ctx, cfg.ctx);
};

function tryToRequireAll(packages, aliases, useKeys) {
  useKeys = useKeys !== undefined ? useKeys : ! _.isArray(packages);
  var packageNames = useKeys ? _.keys(packages) : packages;
  return reduceRequire(getFormattedPackages(packageNames, aliases));
}

function reduceRequire(ctxPkgMapping) {
  return _.reduce(ctxPkgMapping, function requirePkg(ctx, pkgName, ctxName) {
    ctx[ctxName] = require(pkgName);
    return ctx;
  }, {});
}

function getFormattedPackages(packageNames, aliases) {
  return _.reduce(packageNames, function formatPkg(formatted, pkgName) {
    var key = aliases[pkgName] || pkgName;
    formatted[aliases[pkgName] || humps.camelize(key)] = pkgName;
    return formatted;
  }, {});
}