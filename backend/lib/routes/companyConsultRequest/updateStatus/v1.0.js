'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')
  var status = _.get(req, 'body.status')

  async.waterfall([
    function checkParams(cb) {
      if (!id || !status) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function update(cb) {
      ConsultRequestModel.findOneAndUpdate({ _id: id, companyId: req.company._id }, { status: status }, { new: true }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!doc) return cb({ code: 404, message: Message.CONSULT_REQUEST_NOT_FOUND })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.CONSULT_REQUEST_UPDATED, data: doc })
  })
}
