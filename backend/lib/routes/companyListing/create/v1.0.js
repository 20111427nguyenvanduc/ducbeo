'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var body = req.body || {}

  async.waterfall([
    function checkParams(cb) {
      if (!body.propertyId || !body.title) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function create(cb) {
      ListingModel.create({
        companyId: req.company._id,
        propertyId: body.propertyId,
        title: body.title,
        description: body.description,
        status: 'pending',
        createdByUserId: req.companyUser._id,
      }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.LISTING_CREATED, data: doc })
  })
}
