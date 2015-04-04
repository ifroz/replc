'use strict';
var _ = require('lodash'),
    humps = require('humps');
var pkg = require('./pkg');

module.exports = function renderContext(cfg) {
  var ctx = tryToRequireAll(cfg.dependencies, cfg.aliases);
  if (cfg.useDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.dependencies, cfg.aliases)); }
  if (cfg.useDevDependencies) {
    _.assign(ctx, tryToRequireAll(pkg.devDependencies, cfg.aliases)); }
  if (cfg.debugMode) {
    ctx._cfg = cfg; }
  return _.assign(ctx, cfg.ctx);

  function tryToRequireAll(packages, aliases, useKeys) {
    useKeys = useKeys !== undefined ? useKeys : ! _.isArray(packages);
    var packageNames = useKeys ? _.keys(packages) : packages;
    return reduceRequire(getFormattedPackages(packageNames, aliases));
  }

  function reduceRequire(ctxPkgMapping) {
    return _.reduce(ctxPkgMapping, function requirePkg(ctx, pkgName, ctxName) {
      if (isNotExcluded(pkgName)) {
        try {
          ctx[ctxName] = require(process.cwd() + '/node_modules/' + pkgName);
        } catch(e) {
          ctx[ctxName] = require(pkgName);
        } finally {
          return ctx;
        }
      }
    }, {});
    function isNotExcluded(pkgName) {
      return !_.contains(cfg.exclude||[], pkgName);
    }

  }
};

function getFormattedPackages(packageNames, aliases) {
  return _.reduce(packageNames, function formatPkg(formatted, pkgName) {
    var key = aliases[pkgName] || pkgName;
    formatted[aliases[pkgName] || humps.camelize(key)] = pkgName;
    return formatted;
  }, {});
}
