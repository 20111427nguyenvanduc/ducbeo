'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var parsedPage = Math.max(1, parseInt(_.get(req, 'query.page') || _.get(req, 'body.page') || 1))
  var parsedLimit = Math.min(100, Math.max(1, parseInt(_.get(req, 'query.limit') || _.get(req, 'body.limit') || 20)))

  async.waterfall([
    function query(cb) {
      var filter = { memberId: req.member._id }
      ConsultRequestModel.find(filter).sort({ createdAt: -1 }).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).exec(function(err, docs) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        ConsultRequestModel.countDocuments(filter, function(err, total) {
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
