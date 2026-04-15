'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var companyId = req.company._id

  async.parallel({
    totalListings: function(cb) { ListingModel.countDocuments({ companyId: companyId }, cb) },
    activeListings: function(cb) { ListingModel.countDocuments({ companyId: companyId, status: 'approved' }, cb) },
    pendingListings: function(cb) { ListingModel.countDocuments({ companyId: companyId, status: 'pending' }, cb) },
    totalConsultRequests: function(cb) { ConsultRequestModel.countDocuments({ companyId: companyId }, cb) },
    newConsultRequests: function(cb) { ConsultRequestModel.countDocuments({ companyId: companyId, status: 'waiting' }, cb) },
  }, function(err, results) {
    if (err) return res.json({ code: 500, message: Message.SYSTEM_ERROR })
    res.json({ code: 200, data: results })
  })
}
