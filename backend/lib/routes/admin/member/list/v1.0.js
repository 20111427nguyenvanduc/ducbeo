'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var q = req.query || {}
  var parsedPage = Math.max(1, parseInt(q.page || 1))
  var parsedLimit = Math.min(100, Math.max(1, parseInt(q.limit || 20)))
  var query = {}
  if (q.keyword) query.$or = [{ phone: { $regex: q.keyword, $options: 'i' } }, { name: { $regex: q.keyword, $options: 'i' } }]
  if (q.isActive !== undefined) query.isActive = q.isActive === 'true'

  async.waterfall([
    function fetch(cb) {
      MemberModel.find(query).select('-__v').sort({ createdAt: -1 }).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).exec(function(err, docs) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        MemberModel.countDocuments(query, function(err, total) {
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
