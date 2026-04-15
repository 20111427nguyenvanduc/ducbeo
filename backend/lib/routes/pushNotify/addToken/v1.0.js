'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var fcmToken = _.get(req, 'body.fcmToken') || _.get(req, 'body.token')
  var platform = _.get(req, 'body.platform') || 'unknown'

  async.waterfall([
    function checkParams(cb) {
      if (!fcmToken) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function upsert(cb) {
      NotifyTokenModel.findOneAndUpdate(
        { userId: req.member._id, fcmToken: fcmToken },
        { userId: req.member._id, userType: 'member', fcmToken: fcmToken, platform: platform, updatedAt: new Date() },
        { upsert: true, new: true },
        function(err) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          cb(null)
        }
      )
    },
  ], function(err) {
    if (err) return res.json(err)
    res.json({ code: 200, message: { head: 'Thành công', body: 'Đã lưu token thông báo' } })
  })
}
