'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var domain = _.get(req, 'params.domain') || _.get(req, 'query.domain') || _.get(req, 'body.domain')

  async.waterfall([
    function findCompany(cb) {
      var query = { isActive: true }
      if (domain) query.domain = domain
      CompanyModel.findOne(query).select('name phone address logo domain description email').exec(function(err, company) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        if (!company) return cb({ code: 404, message: Message.COMPANY_NOT_FOUND })
        cb(null, company)
      })
    },
  ], function(err, company) {
    if (err) return res.json(err)
    res.json({ code: 200, data: company })
  })
}
