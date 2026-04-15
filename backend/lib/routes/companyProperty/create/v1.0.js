'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var body = req.body || {}
  var required = ['propertyTypeSlug', 'transactionType', 'price', 'area']

  async.waterfall([
    function checkParams(cb) {
      for (var i = 0; i < required.length; i++) {
        if (!body[required[i]]) return cb({ code: 400, message: Message.INVALID_INPUT })
      }
      cb(null)
    },
    function create(cb) {
      PropertyModel.create({
        companyId: req.company._id,
        propertyTypeSlug: body.propertyTypeSlug,
        transactionType: body.transactionType,
        price: body.price,
        area: body.area,
        sellerPhone: body.sellerPhone,
        legalStatus: body.legalStatus,
        province: body.province,
        district: body.district,
        ward: body.ward,
        addressDetail: body.addressDetail,
        coordinates: body.coordinates,
        images: body.images || [],
        video: body.video,
        dynamicFields: body.dynamicFields || {},
        status: 'active',
        createdByUserId: req.companyUser._id,
      }, function(err, doc) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        cb(null, doc)
      })
    },
  ], function(err, doc) {
    if (err) return res.json(err)
    res.json({ code: 200, message: Message.PROPERTY_CREATED, data: doc })
  })
}
