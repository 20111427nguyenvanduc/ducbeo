'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')

  async.waterfall([
    function remove(cb) {
      PropertyModel.findOneAndDelete({ _id: id, companyId: req.company._id }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!doc) return cb({ code: 404, message: Message.PROPERTY_NOT_FOUND })
        cb(null)
      })
    },
  ], function(err) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.PROPERTY_DELETED })
  })
}
