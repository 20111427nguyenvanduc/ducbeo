'use strict'
var Message = require('../../../message')

module.exports = function(req, res) {
  var publicKeys = ['app_version', 'maintenance_mode', 'hotline', 'contact_email', 'listing_duration_days']
  async.waterfall([
    function getConfigs(cb) {
      ConfigModel.find({ key: { $in: publicKeys } }, function(err, configs) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        var result = {}
        configs.forEach(function(c) { result[c.key] = c.value })
        cb(null, result)
      })
    },
    function getBanners(result, cb) {
      BannerModel.find({ isActive: true }).sort({ order: 1 }).exec(function(err, banners) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        result.banners = banners
        cb(null, result)
      })
    },
    function getPropertyTypes(result, cb) {
      PropertyTypeModel.find({ isActive: true }).sort({ order: 1 }).exec(function(err, types) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        result.propertyTypes = types
        cb(null, result)
      })
    },
  ], function(err, result) {
    if (err) return res.json(err)
    res.json({ code: 200, data: result })
  })
}
