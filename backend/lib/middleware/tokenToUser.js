'use strict'
var TokenUtil = require('../utils/token')
var Message = require('../message')

module.exports = function(req, res, next) {
  var token = _.get(req, 'headers.token') || _.get(req, 'body.token')
  var appName = config.get('appName')
  if (!token) return res.json({ code: 401, message: Message.UNAUTHORIZED })

  TokenUtil.getToken(appName, token, function(err, data) {
    if (err || !data) return res.json({ code: 1993, message: Message.TOKEN_EXPIRED })

    MemberModel.findById(data.userId, function(err, member) {
      if (err || !member) return res.json({ code: 401, message: Message.MEMBER_NOT_FOUND })
      if (!member.isActive) return res.json({ code: 403, message: Message.ACCOUNT_LOCKED })
      req.user = member
      req.member = member
      req.userId = member._id
      req.token = token
      req.appName = appName
      next()
    })
  })
}
