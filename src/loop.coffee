
Q = require "q"

module.exports = (timeout, looper) ->

  unless arguments.hasOwnProperty 1
    looper = timeout
    timeout = null

  deferred = Q.defer()

  loops = 0
  isDone = no
  result = undefined

  done = ->
    isDone = yes
    result = arguments[0]

  tick = ->

    try tickPromise = Q looper done, loops++

    catch error
      return deferred.reject error

    tickPromise.always ->
      if isDone
        deferred.resolve result
      else
        tick()

  Q.nextTick tick

  if typeof timeout is "number"
    return Q.timeout deferred.promise, timeout

  deferred.promise
