'use strict'
var Message = require('../../../message')
var TokenUtil = require('../../../utils/token')

var MAX_FAILED_ATTEMPTS = 5

module.exports = function(req, res) {
  var username = _.get(req, 'body.username')
  var password = _.get(req, 'body.password')
  var appName = config.get('companyAppName')
  var tokenExpire = config.get('tokenExpireSeconds') || 604800
  var companyUser, token

  async.waterfall([
    function checkParams(cb) {
      if (!username || !password) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function findUser(cb) {
      CompanyUserModel.findOne({ username: username.toLowerCase().trim() }).populate('companyId').exec(function(err, found) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!found) return cb({ code: 400, message: Message.ACCOUNT_NOT_FOUND })
        if (!found.isActive) return cb({ code: 403, message: Message.ACCOUNT_LOCKED })
        if (found.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) return cb({ code: 403, message: Message.TOO_MANY_FAILED_ATTEMPTS })
        companyUser = found
        cb(null)
      })
    },
    function checkPassword(cb) {
      if (!companyUser.comparePassword(password)) {
        CompanyUserModel.findByIdAndUpdate(companyUser._id, { $inc: { failedLoginAttempts: 1 } }, function() {
          cb({ code: 400, message: Message.PASSWORD_WRONG })
        })
        return
      }
      if (!companyUser.companyId || !companyUser.companyId.isActive) return cb({ code: 403, message: Message.COMPANY_LOCKED })
      cb(null)
    },
    function updateLogin(cb) {
      CompanyUserModel.findByIdAndUpdate(companyUser._id, { failedLoginAttempts: 0, lastLoginAt: new Date() }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
    function createToken(cb) {
      token = TokenUtil.generateToken()
      TokenUtil.saveToken(appName, token, { userId: companyUser._id.toString() }, tokenExpire, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
  ], function(err) {
    if (err) return res.json(err)
    res.json({
      code: 200,
      message: Message.LOGIN_SUCCESS,
      token: token,
      user: {
        _id: companyUser._id,
        username: companyUser.username,
        fullName: companyUser.fullName,
        role: companyUser.role,
        mustChangePassword: companyUser.mustChangePassword,
      },
      company: {
        _id: companyUser.companyId._id,
        name: companyUser.companyId.name,
        logo: companyUser.companyId.logo,
        domain: companyUser.companyId.domain,
      },
    })
  })
}
