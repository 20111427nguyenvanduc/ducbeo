'use strict'
var Message = require('../../../../message')

module.exports = function(req, res) {
  async.parallel({
    totalMembers: function(cb) { MemberModel.countDocuments({}, cb) },
    activeMembers: function(cb) { MemberModel.countDocuments({ isActive: true }, cb) },
    totalCompanies: function(cb) { CompanyModel.countDocuments({}, cb) },
    totalListings: function(cb) { ListingModel.countDocuments({}, cb) },
    pendingListings: function(cb) { ListingModel.countDocuments({ status: 'pending' }, cb) },
    totalConsultRequests: function(cb) { ConsultRequestModel.countDocuments({}, cb) },
    totalConsignRequests: function(cb) { ConsignRequestModel.countDocuments({}, cb) },
    newThisMonth: function(cb) {
      MemberModel.countDocuments({ createdAt: { $gte: moment().startOf('month').toDate() } }, cb)
    },
  }, function(err, results) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: results })
  })
}
