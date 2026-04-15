'use strict'
var redis = require('redis')

module.exports = function(host, port, password) {
  var options = { host: host, port: port }
  if (password) options.password = password

  var client = redis.createClient(options)

  client.on('connect', function() {
    logger.logInfo('Redis connected:', host + ':' + port)
  })

  client.on('error', function(err) {
    logger.logError('Redis error:', err.message)
  })

  setInterval(function() {
    client.ping(function(err) {
      if (err) logger.logError('Redis keepalive ping error:', err.message)
    })
  }, 30000)

  return client
}
