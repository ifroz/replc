var _ = require('lodash'),
    vm = require('vm');
var debug = _.noop;

module.exports = function lodashedEvalFactory(cfg) {
  return function replcEval(code, context, file, cb) {
    var err, result;
    // first, create the Script object to check the syntax

    try {
      overrideLodash(context, cfg.lastResult);
      var script = vm.createScript(code, {
        filename: file,
        displayErrors: false
      });
    } catch (e) {
      debug('parse error %j', code, e);
      err = (isRecoverableError(e, {})) ? new Recoverable(e) : e;
    } finally {
      revertLodash(context, '$0');
    }

    if (!err) {
      try {
        overrideLodash(context, '$0');
        result = script.runInContext(context, { displayErrors: false });
      } catch (e) {
        err = e;
        if (err && process.domain) {
          debug('not recoverable, send to domain');
          process.domain.emit('error', err);
          process.domain.exit();
          return;
        }
      } finally {
        revertLodash(context, '$0');
      }
    }

    cb(err, result);
  };

  function overrideLodash(context) {
    context[cfg.lastResult] = context._;
    context._ = require(getLodashName(cfg));
    function getLodashName(cfg) {
      return _(cfg.aliases).findKey(_.partial(_.isEqual, '_'));
    }
  }

  function revertLodash(context) {
    context._ = context[cfg.lastResult];
  }
};

// If the error is that we've unexpectedly ended the input,
// then let the user try to recover by adding more input.
function isRecoverableError(e) {
  if (e && e.name === 'SyntaxError') {
    var message = e.message;
    if (message === 'Unterminated template literal' ||
        message === 'Missing } in template expression') {
      return true;
    }
    return /^(Unexpected end of input|Unexpected token :)/.test(message);
  }
  return false;
}