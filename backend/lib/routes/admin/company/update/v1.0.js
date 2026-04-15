'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')
  var body = req.body || {}
  var allowed = ['name', 'phone', 'address', 'email', 'domain', 'logo', 'description', 'isActive']
  var updateData = {}
  allowed.forEach(function(f) { if (body[f] !== undefined) updateData[f] = body[f] })

  async.waterfall([
    function update(cb) {
      CompanyModel.findByIdAndUpdate(id, updateData, { new: true }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!doc) return cb({ code: 404, message: Message.COMPANY_NOT_FOUND })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.COMPANY_UPDATED, data: doc })
  })
}
