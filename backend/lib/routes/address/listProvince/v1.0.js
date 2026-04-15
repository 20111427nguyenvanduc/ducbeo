'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  ProvinceModel.find({}).sort({ name: 1 }).exec(function(err, provinces) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: provinces })
  })
}
