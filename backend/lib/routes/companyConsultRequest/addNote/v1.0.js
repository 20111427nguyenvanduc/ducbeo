'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')
  var note = _.get(req, 'body.note')

  async.waterfall([
    function checkParams(cb) {
      if (!id || !note) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function update(cb) {
      var noteObj = { content: note, createdAt: new Date(), createdBy: req.companyUser._id }
      ConsultRequestModel.findOneAndUpdate(
        { _id: id, companyId: req.company._id },
        { $push: { notes: noteObj } },
        { new: true },
        function(err, doc) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          if (!doc) return cb({ code: 404, message: Message.CONSULT_REQUEST_NOT_FOUND })
          cb(null, doc)
        }
      )
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.CONSULT_REQUEST_NOTE_ADDED, data: doc })
  })
}
