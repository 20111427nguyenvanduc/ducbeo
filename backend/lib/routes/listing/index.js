const Message = require('../../message');
const { LISTING_STATUS } = require('../../const');

const list = {
  v1: async (req, res) => {
    try {
      const {
        propertyTypeSlug,
        transactionType,
        province,
        district,
        priceFrom,
        priceTo,
        areaFrom,
        areaTo,
        legalStatus,
        keyword,
        sort,
        page = 1,
        limit = 20,
      } = req.body;

      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      // Only show approved, non-expired listings
      const query = { status: LISTING_STATUS.APPROVED };

      // Build property query for population filter
      const propertyMatch = {};
      if (propertyTypeSlug) propertyMatch.propertyTypeSlug = propertyTypeSlug;
      if (transactionType) propertyMatch.transactionType = transactionType;
      if (province) propertyMatch.province = province;
      if (district) propertyMatch.district = district;
      if (legalStatus) propertyMatch.legalStatus = legalStatus;
      if (priceFrom !== undefined || priceTo !== undefined) {
        propertyMatch.price = {};
        if (priceFrom !== undefined) propertyMatch.price.$gte = Number(priceFrom);
        if (priceTo !== undefined) propertyMatch.price.$lte = Number(priceTo);
      }
      if (areaFrom !== undefined || areaTo !== undefined) {
        propertyMatch.area = {};
        if (areaFrom !== undefined) propertyMatch.area.$gte = Number(areaFrom);
        if (areaTo !== undefined) propertyMatch.area.$lte = Number(areaTo);
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { 'property.price': 1 };
      else if (sort === 'price_desc') sortOption = { 'property.price': -1 };
      else if (sort === 'area') sortOption = { 'property.area': -1 };

      // Use aggregation for filtering on populated property fields
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: 'properties',
            localField: 'propertyId',
            foreignField: '_id',
            as: 'property',
          },
        },
        { $unwind: { path: '$property', preserveNullAndEmpty: false } },
      ];

      if (Object.keys(propertyMatch).length > 0) {
        const propertyFilter = {};
        Object.keys(propertyMatch).forEach((k) => {
          propertyFilter[`property.${k}`] = propertyMatch[k];
        });
        pipeline.push({ $match: propertyFilter });
      }

      if (keyword) {
        pipeline.push({
          $match: {
            $or: [
              { title: { $regex: keyword, $options: 'i' } },
              { 'property.addressDetail': { $regex: keyword, $options: 'i' } },
            ],
          },
        });
      }

      // Lookup company
      pipeline.push({
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      });
      pipeline.push({ $unwind: { path: '$company', preserveNullAndEmpty: true } });

      const countPipeline = [...pipeline, { $count: 'total' }];
      pipeline.push({ $sort: sortOption });
      pipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
      pipeline.push({ $limit: parsedLimit });

      const [listings, countResult] = await Promise.all([
        ListingModel.aggregate(pipeline),
        ListingModel.aggregate(countPipeline),
      ]);

      const total = countResult.length > 0 ? countResult[0].total : 0;

      return res.json({
        success: true,
        data: {
          listings,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('listing/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await ListingModel.findOne({ _id: id, status: LISTING_STATUS.APPROVED })
        .populate('propertyId')
        .populate('companyId', 'name logo phone address email domain');

      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      // Increment view count
      await ListingModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

      return res.json({ success: true, data: listing });
    } catch (err) {
      logger.logError('listing/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail };
