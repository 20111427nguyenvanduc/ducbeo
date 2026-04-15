'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var body = req.body || {}
  var allowedFields = ['name', 'email', 'avatar', 'dob', 'gender', 'address']
  var updateData = {}
  allowedFields.forEach(function(f) { if (body[f] !== undefined) updateData[f] = body[f] })

  async.waterfall([
    function update(cb) {
      MemberModel.findByIdAndUpdate(req.member._id, updateData, { new: true }, function(err, member) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, member)
      })
    },
  ], function(err, member) {
    if (err) return res.json(err)
    res.json({
      code: 200,
      message: Message.MEMBER_UPDATED,
      data: {
        _id: member._id,
        phone: member.phone,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
        dob: member.dob,
        gender: member.gender,
        address: member.address,
      },
    })
  })
}
