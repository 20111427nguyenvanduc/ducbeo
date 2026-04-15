'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  NotificationModel.countDocuments({ userId: req.member._id, userType: 'member', isSeen: false }, function(err, count) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: { count: count } })
  })
}
