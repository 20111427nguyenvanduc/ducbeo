'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  var body = req.body || {}
  var name = body.name
  var username = body.username
  var password = body.password

  async.waterfall([
    function checkParams(cb) {
      if (!name || !username || !password) return cb({ code: 400, message: Message.INVALID_INPUT })
      cb(null)
    },
    function checkDomain(cb) {
      if (!body.domain) return cb(null)
      CompanyModel.findOne({ domain: body.domain }, function(err, existing) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (existing) return cb({ code: 409, message: { head: 'Lỗi', body: 'Domain đã được sử dụng' } })
        cb(null)
      })
    },
    function checkUsername(cb) {
      CompanyUserModel.findOne({ username: username.toLowerCase() }, function(err, existing) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (existing) return cb({ code: 409, message: { head: 'Lỗi', body: 'Tên đăng nhập đã tồn tại' } })
        cb(null)
      })
    },
    function createCompany(cb) {
      CompanyModel.create({
        name: name,
        phone: body.phone || '',
        address: body.address || '',
        email: body.email || '',
        domain: body.domain || undefined,
        isActive: true,
        createdBy: req.admin._id,
      }, function(err, company) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, company)
      })
    },
    function createUser(company, cb) {
      var passwordHash = CompanyUserModel.hashPassword(password)
      CompanyUserModel.create({
        companyId: company._id,
        username: username.toLowerCase(),
        passwordHash: passwordHash,
        role: 'owner',
        mustChangePassword: true,
        isActive: true,
      }, function(err) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, company)
      })
    },
  ], function(err, company) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.COMPANY_CREATED, data: company })
  })
}
