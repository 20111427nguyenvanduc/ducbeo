'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')

  async.waterfall([
    function approve(cb) {
      ListingModel.findByIdAndUpdate(id, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.admin._id,
        rejectReason: '',
      }, { new: true }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!doc) return cb({ code: 404, message: Message.LISTING_NOT_FOUND })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.LISTING_APPROVED, data: doc })
  })
}
