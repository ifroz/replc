var _ = require('lodash');

module.exports = {
  ensureArray: function ensureArray(val) {
    return val ? _.isArray(val) ? val : [val] : null;
  }
};