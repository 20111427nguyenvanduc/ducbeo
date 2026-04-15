'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')
  ListingModel.findOneAndDelete({ _id: id, companyId: req.company._id }, function(err, doc) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    if (!doc) return res.json({ code: 404, message: Message.LISTING_NOT_FOUND })
    res.json({ code: 200, message: Message.LISTING_DELETED })
  })
}
