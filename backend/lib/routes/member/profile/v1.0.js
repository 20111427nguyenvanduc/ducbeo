'use strict'

module.exports = function(req, res) {
  var member = req.member
  res.json({
    code: 200,
    data: {
      _id: member._id,
      phone: member.phone,
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      dob: member.dob,
      gender: member.gender,
      address: member.address,
      createdAt: member.createdAt,
    },
  })
}
