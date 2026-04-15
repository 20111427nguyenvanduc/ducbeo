'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var id = _.get(req, 'body.id') || _.get(req, 'params.id')

  async.waterfall([
    function findMember(cb) {
      MemberModel.findById(id, function(err, member) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!member) return cb({ code: 404, message: Message.MEMBER_NOT_FOUND })
        cb(null, member)
      })
    },
    function toggleLock(member, cb) {
      var newIsActive = !member.isActive
      MemberModel.findByIdAndUpdate(id, { isActive: newIsActive }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, newIsActive)
      })
    },
  ], function(err, newIsActive) {
    if (err) return res.json(err)
    res.json({ code: 200, message: newIsActive ? Message.MEMBER_UNLOCKED : Message.MEMBER_LOCKED, data: { isActive: newIsActive } })
  })
}
