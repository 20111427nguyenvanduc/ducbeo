'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var q = req.query || {}
  var parsedPage = Math.max(1, parseInt(q.page || 1))
  var parsedLimit = Math.min(100, Math.max(1, parseInt(q.limit || 20)))
  var query = {}
  if (q.keyword) query.name = { $regex: q.keyword, $options: 'i' }
  if (q.isActive !== undefined) query.isActive = q.isActive === 'true'

  async.waterfall([
    function fetch(cb) {
      CompanyModel.find(query).sort({ createdAt: -1 }).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).exec(function(err, docs) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        CompanyModel.countDocuments(query, function(err, total) {
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
