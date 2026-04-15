'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'params.id')
  ConsultRequestModel.findOne({ _id: id, memberId: req.member._id }).exec(function(err, doc) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    if (!doc) return res.json({ code: 404, message: Message.CONSULT_REQUEST_NOT_FOUND })
    res.json({ code: 200, data: doc })
  })
}
