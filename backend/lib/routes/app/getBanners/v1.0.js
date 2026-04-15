'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  BannerModel.find({ isActive: true }).sort({ order: 1 }).exec(function(err, banners) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: banners })
  })
}
