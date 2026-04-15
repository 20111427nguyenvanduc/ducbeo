'use strict'
var TokenUtil = require('../utils/token')
var Message = require('../message')

module.exports = function(req, res, next) {
  var token = _.get(req, 'headers.token') || _.get(req, 'body.token')
  var appName = config.get('companyAppName')
  if (!token) return res.json({ code: 401, message: Message.UNAUTHORIZED })

  TokenUtil.getToken(appName, token, function(err, data) {
    if (err || !data) return res.json({ code: 1993, message: Message.TOKEN_EXPIRED })

    CompanyUserModel.findById(data.userId).populate('companyId').exec(function(err, companyUser) {
      if (err || !companyUser) return res.json({ code: 401, message: Message.ACCOUNT_NOT_FOUND })
      if (!companyUser.isActive) return res.json({ code: 403, message: Message.ACCOUNT_LOCKED })
      if (!companyUser.companyId || !companyUser.companyId.isActive) return res.json({ code: 403, message: Message.COMPANY_LOCKED })
      req.companyUser = companyUser
      req.company = companyUser.companyId
      req.userId = companyUser._id
      req.token = token
      req.appName = appName
      next()
    })
  })
}
