'use strict'
var Message = require('../../../message')
var TokenUtil = require('../../../utils/token')

module.exports = function(req, res) {
  TokenUtil.removeToken(req.appName, req.token, function(err) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, message: Message.LOGOUT_SUCCESS })
  })
}
