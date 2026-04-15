'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var body = req.body || {}
  var name = body.name
  var phone = body.phone || req.member.phone
  var address = body.address
  var propertyType = body.propertyType
  var note = body.note

  async.waterfall([
    function checkParams(cb) {
      if (!name || !phone) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function create(cb) {
      ConsignRequestModel.create({
        memberId: req.member._id,
        name: name,
        phone: phone,
        address: address,
        propertyType: propertyType,
        note: note,
        status: 'new',
      }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.CONSIGN_REQUEST_CREATED, data: doc })
  })
}
