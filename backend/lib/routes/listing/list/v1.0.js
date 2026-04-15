'use strict'
var Message = require('../../../message')
var Const = require('../../../const')

module.exports = function(req, res) {
  var body = req.body || {}
  var propertyTypeSlug = body.propertyTypeSlug
  var transactionType = body.transactionType
  var province = body.province
  var district = body.district
  var priceFrom = body.priceFrom
  var priceTo = body.priceTo
  var areaFrom = body.areaFrom
  var areaTo = body.areaTo
  var legalStatus = body.legalStatus
  var keyword = body.keyword
  var sort = body.sort
  var parsedPage = Math.max(1, parseInt(body.page) || 1)
  var parsedLimit = Math.min(100, Math.max(1, parseInt(body.limit) || 20))

  async.waterfall([
    function buildPipeline(cb) {
      var query = { status: Const.LISTING_STATUS.APPROVED }
      var propertyMatch = {}
      if (propertyTypeSlug) propertyMatch.propertyTypeSlug = propertyTypeSlug
      if (transactionType) propertyMatch.transactionType = transactionType
      if (province) propertyMatch.province = province
      if (district) propertyMatch.district = district
      if (legalStatus) propertyMatch.legalStatus = legalStatus
      if (priceFrom !== undefined || priceTo !== undefined) {
        propertyMatch.price = {}
        if (priceFrom !== undefined) propertyMatch.price.$gte = Number(priceFrom)
        if (priceTo !== undefined) propertyMatch.price.$lte = Number(priceTo)
      }
      if (areaFrom !== undefined || areaTo !== undefined) {
        propertyMatch.area = {}
        if (areaFrom !== undefined) propertyMatch.area.$gte = Number(areaFrom)
        if (areaTo !== undefined) propertyMatch.area.$lte = Number(areaTo)
      }

      var sortOption = { createdAt: -1 }
      if (sort === 'price_asc') sortOption = { 'property.price': 1 }
      else if (sort === 'price_desc') sortOption = { 'property.price': -1 }
      else if (sort === 'area') sortOption = { 'property.area': -1 }

      var pipeline = [
        { $match: query },
        { $lookup: { from: 'properties', localField: 'propertyId', foreignField: '_id', as: 'property' } },
        { $unwind: { path: '$property', preserveNullAndEmptyArrays: false } },
      ]

      if (Object.keys(propertyMatch).length > 0) {
        var propertyFilter = {}
        Object.keys(propertyMatch).forEach(function(k) { propertyFilter['property.' + k] = propertyMatch[k] })
        pipeline.push({ $match: propertyFilter })
      }

      if (keyword) {
        pipeline.push({ $match: { $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { 'property.addressDetail': { $regex: keyword, $options: 'i' } },
        ] } })
      }

      pipeline.push({ $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'company' } })
      pipeline.push({ $unwind: { path: '$company', preserveNullAndEmptyArrays: true } })

      cb(null, pipeline, sortOption)
    },
    function query(pipeline, sortOption, cb) {
      var countPipeline = pipeline.concat([{ $count: 'total' }])
      var dataPipeline = pipeline.concat([
        { $sort: sortOption },
        { $skip: (parsedPage - 1) * parsedLimit },
        { $limit: parsedLimit },
      ])
      ListingModel.aggregate(countPipeline, function(err, countResult) {
        if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
        ListingModel.aggregate(dataPipeline, function(err, listings) {
          if (err) return cb({ code: 500, message: Message.SYSTEM_ERROR })
          var total = countResult.length > 0 ? countResult[0].total : 0
          cb(null, listings, total)
        })
      })
    },
  ], function(err, listings, total) {
    if (err) return res.json(err)
    res.json({
      code: 200,
      data: {
        listings: listings,
        total: total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    })
  })
}
