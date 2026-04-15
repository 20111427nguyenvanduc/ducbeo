'use strict'
var TokenUtil = require('../utils/token')

module.exports = function(req, res, next) {
  var token = _.get(req, 'headers.token') || _.get(req, 'body.token')
  var appName = config.get('appName')
  if (!token) return next()

  TokenUtil.getToken(appName, token, function(err, data) {
    if (err || !data) return next()
    MemberModel.findById(data.userId, function(err, member) {
      if (err || !member || !member.isActive) return next()
      req.member = member
      req.user = member
      next()
    })
  })
}
