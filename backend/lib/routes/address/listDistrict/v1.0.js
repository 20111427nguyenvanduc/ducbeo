'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var provinceCode = _.get(req, 'body.provinceCode') || _.get(req, 'query.provinceCode')
  var query = provinceCode ? { provinceCode: provinceCode } : {}
  DistrictModel.find(query).sort({ name: 1 }).exec(function(err, districts) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: districts })
  })
}
