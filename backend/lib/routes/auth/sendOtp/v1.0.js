'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var phone = _.get(req, 'body.phone')
  var expireSeconds = config.get('otp.expireSeconds') || 300

  async.waterfall([
    function checkParams(cb) {
      if (!phone) return cb({ code: 400, message: Message.PHONE_REQUIRED })
      var phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/
      if (!phoneRegex.test(phone)) return cb({ code: 400, message: Message.INVALID_PHONE })
      cb(null)
    },
    function generateOtp(cb) {
      var otp = Math.floor(100000 + Math.random() * 900000).toString()
      var redisKey = 'otp:' + phone
      global.redisClient.setex(redisKey, expireSeconds, otp, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, otp)
      })
    },
  ], function(err, otp) {
    if (err) return res.json(err)
    var result = { code: 200, message: Message.OTP_SENT }
    if (process.env.NODE_ENV !== 'production') result.otp = otp
    res.json(result)
  })
}
