'use strict'
var crypto = require('crypto')

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function saveToken(appName, token, data, expireSeconds, cb) {
  var key = appName + ':token:' + token
  global.redisClient.setex(key, expireSeconds, JSON.stringify(data), function(err) {
    cb(err)
  })
}

function getToken(appName, token, cb) {
  var key = appName + ':token:' + token
  global.redisClient.get(key, function(err, data) {
    if (err || !data) return cb(null, null)
    try {
      cb(null, JSON.parse(data))
    } catch (e) {
      cb(null, null)
    }
  })
}

function removeToken(appName, token, cb) {
  var key = appName + ':token:' + token
  global.redisClient.del(key, function(err) {
    cb(err)
  })
}

module.exports = { generateToken, saveToken, getToken, removeToken }
