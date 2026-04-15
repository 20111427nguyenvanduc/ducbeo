'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var currentPassword = _.get(req, 'body.currentPassword')
  var newPassword = _.get(req, 'body.newPassword')

  async.waterfall([
    function checkParams(cb) {
      if (!currentPassword || !newPassword) return cb({ code: 400, message: Message.INVALID_INPUT })
      if (!req.companyUser.comparePassword(currentPassword)) return cb({ code: 400, message: Message.PASSWORD_WRONG })
      if (newPassword.length < 6) return cb({ code: 400, message: { head: 'Lỗi', body: 'Mật khẩu mới phải có ít nhất 6 ký tự' } })
      cb(null)
    },
    function update(cb) {
      var passwordHash = CompanyUserModel.hashPassword(newPassword)
      CompanyUserModel.findByIdAndUpdate(req.companyUser._id, { passwordHash: passwordHash, mustChangePassword: false }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null)
      })
    },
  ], function(err) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.PASSWORD_CHANGED })
  })
}
