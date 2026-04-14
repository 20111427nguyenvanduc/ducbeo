const Message = require('../../message');

const create = {
  v1: async (req, res) => {
    try {
      const companyId = req.company._id;
      const {
        propertyTypeSlug,
        transactionType,
        price,
        area,
        sellerPhone,
        legalStatus,
        province,
        district,
        ward,
        addressDetail,
        coordinates,
        images,
        video,
        dynamicFields,
      } = req.body;

      if (!propertyTypeSlug || !transactionType || !price || !area) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const property = await PropertyModel.create({
        companyId,
        propertyTypeSlug,
        transactionType,
        price,
        area,
        sellerPhone,
        legalStatus,
        province,
        district,
        ward,
        addressDetail,
        coordinates,
        images: images || [],
        video,
        dynamicFields: dynamicFields || {},
        status: 'active',
        createdByUserId: req.companyUser._id,
      });

      return res.json({
        success: true,
        message: Message.PROPERTY_CREATED,
        data: property,
      });
    } catch (err) {
      logger.logError('companyProperty/create', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const list = {
  v1: async (req, res) => {
    try {
      const companyId = req.company._id;
      const { page = 1, limit = 20, status, propertyTypeSlug, transactionType } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = { companyId };
      if (status) query.status = status;
      if (propertyTypeSlug) query.propertyTypeSlug = propertyTypeSlug;
      if (transactionType) query.transactionType = transactionType;

      const [properties, total] = await Promise.all([
        PropertyModel.find(query)
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        PropertyModel.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          properties,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('companyProperty/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await PropertyModel.findOne({ _id: id, companyId: req.company._id });
      if (!property) {
        return res.json({ success: false, message: Message.PROPERTY_NOT_FOUND });
      }
      return res.json({ success: true, data: property });
    } catch (err) {
      logger.logError('companyProperty/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const allowedFields = [
        'price', 'area', 'sellerPhone', 'legalStatus', 'province', 'district', 'ward',
        'addressDetail', 'coordinates', 'images', 'video', 'dynamicFields', 'status',
      ];

      const updateData = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      });

      const property = await PropertyModel.findOneAndUpdate(
        { _id: id, companyId: req.company._id },
        updateData,
        { new: true }
      );

      if (!property) {
        return res.json({ success: false, message: Message.PROPERTY_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.PROPERTY_UPDATED, data: property });
    } catch (err) {
      logger.logError('companyProperty/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const remove = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const property = await PropertyModel.findOneAndDelete({ _id: id, companyId: req.company._id });
      if (!property) {
        return res.json({ success: false, message: Message.PROPERTY_NOT_FOUND });
      }
      return res.json({ success: true, message: Message.PROPERTY_DELETED });
    } catch (err) {
      logger.logError('companyProperty/remove', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create, list, detail, update, remove };
