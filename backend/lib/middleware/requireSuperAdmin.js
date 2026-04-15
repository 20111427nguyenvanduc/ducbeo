'use strict'
var Message = require('../message')
var Const = require('../const')

module.exports = function(req, res, next) {
  if (!req.admin || req.admin.role !== Const.ADMIN_ROLE.SUPER_ADMIN) {
    return res.json({ code: 403, message: Message.FORBIDDEN })
  }
  next()
}
