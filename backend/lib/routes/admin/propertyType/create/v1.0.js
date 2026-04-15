'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var body = req.body || {}

  async.waterfall([
    function checkParams(cb) {
      if (!body.name || !body.slug) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function create(cb) {
      PropertyTypeModel.create({
        name: body.name,
        slug: body.slug,
        icon: body.icon || '',
        isActive: body.isActive !== false,
        order: body.order || 0,
      }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.PROPERTY_TYPE_CREATED, data: doc })
  })
}
