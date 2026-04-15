'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var key = _.get(req, 'body.key') || _.get(req, 'params.key')
  var value = _.get(req, 'body.value')

  async.waterfall([
    function checkParams(cb) {
      if (!key || value === undefined) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function update(cb) {
      ConfigModel.findOneAndUpdate({ key: key }, { value: value }, { new: true, upsert: true }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.CONFIG_UPDATED, data: doc })
  })
}
