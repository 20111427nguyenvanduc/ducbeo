'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var parsedPage = Math.max(1, parseInt(_.get(req, 'body.page') || _.get(req, 'query.page') || 1))
  var parsedLimit = Math.min(100, Math.max(1, parseInt(_.get(req, 'body.limit') || _.get(req, 'query.limit') || 20)))
  var filter = { userId: req.member._id, userType: 'member' }

  async.waterfall([
    function query(cb) {
      NotificationModel.find(filter).sort({ createdAt: -1 }).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).exec(function(err, docs) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        NotificationModel.countDocuments(filter, function(err, total) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          cb(null, docs, total)
        })
      })
    },
  ], function(err, docs, total) {
    if (err) return res.json(err)
    res.json({ code: 200, data: { list: docs, total: total, page: parsedPage, limit: parsedLimit } })
  })
}
