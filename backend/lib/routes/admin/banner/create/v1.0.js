'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var body = req.body || {}

  async.waterfall([
    function checkParams(cb) {
      if (!body.title || !body.imageUrl) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function create(cb) {
      BannerModel.create({
        title: body.title,
        imageUrl: body.imageUrl,
        link: body.link || '',
        isActive: body.isActive !== false,
        order: body.order || 0,
      }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.BANNER_CREATED, data: doc })
  })
}
