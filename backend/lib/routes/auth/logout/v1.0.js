'use strict'
var Message = require('../../../message')
var TokenUtil = require('../../../utils/token')

module.exports = function(req, res) {
  var token = req.token
  var appName = req.appName

  async.waterfall([
    function removeToken(cb) {
      TokenUtil.removeToken(appName, token, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
  ], function(err) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.LOGOUT_SUCCESS })
  })
}
