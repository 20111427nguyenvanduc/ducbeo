'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var q = req.query || {}
  var parsedPage = Math.max(1, parseInt(q.page || 1))
  var parsedLimit = Math.min(100, Math.max(1, parseInt(q.limit || 20)))
  var query = {}
  if (q.status) query.status = q.status
  if (q.companyId) query.companyId = q.companyId
  if (q.keyword) query.title = { $regex: q.keyword, $options: 'i' }

  async.waterfall([
    function fetch(cb) {
      var pipeline = [
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: (parsedPage - 1) * parsedLimit },
        { $limit: parsedLimit },
        { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'company' } },
        { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'properties', localField: 'propertyId', foreignField: '_id', as: 'property' } },
        { $unwind: { path: '$property', preserveNullAndEmptyArrays: true } },
      ]
      var countPipeline = [{ $match: query }, { $count: 'total' }]
      ListingModel.aggregate(countPipeline, function(err, countResult) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        ListingModel.aggregate(pipeline, function(err, docs) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          var total = countResult.length > 0 ? countResult[0].total : 0
          cb(null, docs, total)
        })
      })
    },
  ], function(err, docs, total) {
    if (err) return res.json(err)
    res.json({ code: 200, data: { list: docs, total: total, page: parsedPage, limit: parsedLimit } })
  })
}
