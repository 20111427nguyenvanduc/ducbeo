'use strict'
var Message = require('../../../message')
var Const = require('../../../const')

module.exports = function(req, res) {
  var id = _.get(req, 'params.id')

  async.waterfall([
    function findListing(cb) {
      ListingModel.findOne({ _id: id, status: Const.LISTING_STATUS.APPROVED })
        .populate('propertyId')
        .populate('companyId', 'name logo phone address email domain')
        .exec(function(err, listing) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          if (!listing) return cb({ code: 404, message: Message.LISTING_NOT_FOUND })
          cb(null, listing)
        })
    },
    function incrementView(listing, cb) {
      ListingModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, function() { cb(null, listing) })
    },
  ], function(err, listing) {
    if (err) return res.json(err)
    res.json({ code: 200, data: listing })
  })
}
