const Message = require('../../message');
const { LISTING_STATUS } = require('../../const');
const NotificationService = require('../../services/notification');

const DEFAULT_LISTING_DAYS = 30;

const create = {
  v1: async (req, res) => {
    try {
      const { propertyId, title, description, durationDays } = req.body;
      if (!propertyId || !title) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      // Verify property belongs to this company
      const property = await PropertyModel.findOne({ _id: propertyId, companyId: req.company._id });
      if (!property) {
        return res.json({ success: false, message: Message.PROPERTY_NOT_FOUND });
      }

      const days = durationDays || DEFAULT_LISTING_DAYS;
      const expiredAt = moment().add(days, 'days').toDate();

      const listing = await ListingModel.create({
        companyId: req.company._id,
        propertyId,
        title,
        description: description || '',
        status: LISTING_STATUS.PENDING,
        expiredAt,
        createdByUserId: req.companyUser._id,
      });

      return res.json({
        success: true,
        message: Message.LISTING_CREATED,
        data: listing,
      });
    } catch (err) {
      logger.logError('companyListing/create', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = { companyId: req.company._id };
      if (status) query.status = status;

      const [listings, total] = await Promise.all([
        ListingModel.find(query)
          .populate('propertyId', 'propertyTypeSlug transactionType price area province district')
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        ListingModel.countDocuments(query),
      ]);

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
      logger.logError('companyListing/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await ListingModel.findOne({ _id: id, companyId: req.company._id })
        .populate('propertyId')
        .populate('createdByUserId', 'username fullName');

      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      return res.json({ success: true, data: listing });
    } catch (err) {
      logger.logError('companyListing/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const listing = await ListingModel.findOne({ _id: id, companyId: req.company._id });
      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      if (listing.status === LISTING_STATUS.APPROVED) {
        return res.json({ success: false, message: 'Không thể chỉnh sửa tin đăng đã được duyệt' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;

      const updated = await ListingModel.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, message: Message.LISTING_UPDATED, data: updated });
    } catch (err) {
      logger.logError('companyListing/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const remove = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await ListingModel.findOneAndDelete({
        _id: id,
        companyId: req.company._id,
        status: { $in: [LISTING_STATUS.PENDING, LISTING_STATUS.REJECTED, LISTING_STATUS.EXPIRED] },
      });

      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.LISTING_DELETED });
    } catch (err) {
      logger.logError('companyListing/remove', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const extend = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { durationDays = DEFAULT_LISTING_DAYS } = req.body;

      const listing = await ListingModel.findOne({ _id: id, companyId: req.company._id });
      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      const baseDate = listing.expiredAt && listing.expiredAt > new Date() ? listing.expiredAt : new Date();
      const expiredAt = moment(baseDate).add(durationDays, 'days').toDate();

      const updated = await ListingModel.findByIdAndUpdate(
        id,
        { expiredAt, status: LISTING_STATUS.APPROVED },
        { new: true }
      );

      return res.json({ success: true, message: Message.LISTING_EXTENDED, data: updated });
    } catch (err) {
      logger.logError('companyListing/extend', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create, list, detail, update, remove, extend };
