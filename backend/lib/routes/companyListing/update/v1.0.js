'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')
  var body = req.body || {}
  var allowed = ['title', 'description']
  var updateData = {}
  allowed.forEach(function(f) { if (body[f] !== undefined) updateData[f] = body[f] })

  async.waterfall([
    function update(cb) {
      ListingModel.findOneAndUpdate({ _id: id, companyId: req.company._id }, updateData, { new: true }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!doc) return cb({ code: 404, message: Message.LISTING_NOT_FOUND })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.LISTING_UPDATED, data: doc })
  })
}
