'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  ConfigModel.find({}).exec(function(err, docs) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: docs })
  })
}
