var _ = require('lodash'),
    vm = require('vm');
var debug = _.noop;

module.exports = function defaultEval(code, context, file, cb) {
  var err, result;
  // first, create the Script object to check the syntax

  try {
    var script = vm.createScript(code, {
      filename: file,
      displayErrors: false
    });
  } catch (e) {
    debug('parse error %j', code, e);
    err = (isRecoverableError(e, {})) ? new Recoverable(e) : e;
  }

  if (!err) {
    try {
      result = script.runInContext(context, { displayErrors: false });
    } catch (e) {
      err = e;
      if (err && process.domain) {
        debug('not recoverable, send to domain');
        process.domain.emit('error', err);
        process.domain.exit();
        return;
      }
    }
  }

  cb(err, result);
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

