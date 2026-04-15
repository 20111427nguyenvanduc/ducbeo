'use strict'
var Message = require('../../../../message')
var TokenUtil = require('../../../../utils/token')

module.exports = function(req, res) {
  var username = _.get(req, 'body.username')
  var password = _.get(req, 'body.password')
  var appName = config.get('cmsAppName')
  var tokenExpire = config.get('tokenExpireSeconds') || 604800
  var admin, token

  async.waterfall([
    function checkParams(cb) {
      if (!username || !password) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function findAdmin(cb) {
      AdminModel.findOne({ username: username.toLowerCase().trim() }, function(err, found) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!found) return cb({ code: 400, message: Message.ACCOUNT_NOT_FOUND })
        if (!found.isActive) return cb({ code: 403, message: Message.ACCOUNT_LOCKED })
        if (!found.comparePassword(password)) return cb({ code: 400, message: Message.PASSWORD_WRONG })
        admin = found
        cb(null)
      })
    },
    function updateLogin(cb) {
      AdminModel.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
    function createToken(cb) {
      token = TokenUtil.generateToken()
      TokenUtil.saveToken(appName, token, { userId: admin._id.toString() }, tokenExpire, function(err) {
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
      user: { _id: admin._id, username: admin.username, fullName: admin.fullName, role: admin.role },
    })
  })
}
