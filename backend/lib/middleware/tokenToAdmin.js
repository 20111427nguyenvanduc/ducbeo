'use strict'
var TokenUtil = require('../utils/token')
var Message = require('../message')

module.exports = function(req, res, next) {
  var token = _.get(req, 'headers.token') || _.get(req, 'body.token')
  var appName = config.get('cmsAppName')
  if (!token) return res.json({ code: 401, message: Message.UNAUTHORIZED })

  TokenUtil.getToken(appName, token, function(err, data) {
    if (err || !data) return res.json({ code: 1993, message: Message.TOKEN_EXPIRED })

    AdminModel.findById(data.userId, function(err, admin) {
      if (err || !admin) return res.json({ code: 401, message: Message.ACCOUNT_NOT_FOUND })
      if (!admin.isActive) return res.json({ code: 403, message: Message.ACCOUNT_LOCKED })
      req.admin = admin
      req.userId = admin._id
      req.token = token
      req.appName = appName
      next()
    })
  })
}
