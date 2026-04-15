'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var districtCode = _.get(req, 'body.districtCode') || _.get(req, 'query.districtCode')
  var query = districtCode ? { districtCode: districtCode } : {}
  WardModel.find(query).sort({ name: 1 }).exec(function(err, wards) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: wards })
  })
}
