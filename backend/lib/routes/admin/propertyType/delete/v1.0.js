'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')
  PropertyTypeModel.findByIdAndDelete(id, function(err, doc) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    if (!doc) return res.json({ code: 404, message: Message.PROPERTY_TYPE_NOT_FOUND })
    res.json({ code: 200, message: Message.PROPERTY_TYPE_DELETED })
  })
}
