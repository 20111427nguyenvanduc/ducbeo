'use strict'
var Message = require('../../../message')
var TokenUtil = require('../../../utils/token')

module.exports = function(req, res) {
  var phone = _.get(req, 'body.phone')
  var otp = _.get(req, 'body.otp')
  var appName = config.get('appName')
  var tokenExpire = config.get('tokenExpireSeconds') || 604800
  var member, token

  async.waterfall([
    function checkParams(cb) {
      if (!phone || !otp) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function verifyOtp(cb) {
      var redisKey = 'otp:' + phone
      global.redisClient.get(redisKey, function(err, stored) {
        if (err || !stored) return cb({ code: 400, message: Message.OTP_INVALID })
        if (stored !== otp) return cb({ code: 400, message: Message.OTP_INVALID })
        global.redisClient.del(redisKey, function() { cb(null) })
      })
    },
    function findOrCreateMember(cb) {
      MemberModel.findOne({ phone: phone }, function(err, found) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (found) {
          if (!found.isActive) return cb({ code: 403, message: Message.ACCOUNT_LOCKED })
          member = found
          return cb(null)
        }
        MemberModel.create({ phone: phone, isActive: true }, function(err, created) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          member = created
          cb(null)
        })
      })
    },
    function updateLastLogin(cb) {
      MemberModel.findByIdAndUpdate(member._id, { lastLoginAt: new Date() }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
    function createToken(cb) {
      token = TokenUtil.generateToken()
      TokenUtil.saveToken(appName, token, { userId: member._id.toString() }, tokenExpire, function(err) {
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
        _id: member._id,
        phone: member.phone,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
      },
    })
  })
}
