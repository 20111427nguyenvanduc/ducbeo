'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')

  async.waterfall([
    function update(cb) {
      var query = id ? { _id: id, userId: req.member._id } : { userId: req.member._id, userType: 'member' }
      NotificationModel.updateMany(query, { isSeen: true }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
  ], function(err) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.NOTIFICATION_SEEN })
  })
}
