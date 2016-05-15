var Q;

Q = require("q");

module.exports = function(timeout, looper) {
  var deferred, done, isDone, loops, result, tick;
  if (!arguments.hasOwnProperty(1)) {
    looper = timeout;
    timeout = null;
  }
  deferred = Q.defer();
  loops = 0;
  isDone = false;
  result = void 0;
  done = function() {
    isDone = true;
    return result = arguments[0];
  };
  tick = function() {
    var error, tickPromise;
    try {
      tickPromise = Q(looper(done, loops++));
    } catch (error1) {
      error = error1;
      return deferred.reject(error);
    }
    return tickPromise.always(function() {
      if (isDone) {
        return deferred.resolve(result);
      } else {
        return tick();
      }
    });
  };
  Q.nextTick(tick);
  if (typeof timeout === "number") {
    return Q.timeout(deferred.promise, timeout);
  }
  return deferred.promise;
};

//# sourceMappingURL=../../map/src/loop.map
