const Message = require('../../../message');
const { LISTING_STATUS } = require('../../../const');
const NotificationService = require('../../../services/notification');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, companyId, keyword } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = {};
      if (status) query.status = status;
      if (companyId) query.companyId = companyId;

      const pipeline = [{ $match: query }];
      if (keyword) {
        pipeline.push({ $match: { title: { $regex: keyword, $options: 'i' } } });
      }

      const countPipeline = [...pipeline, { $count: 'total' }];
      pipeline.push({ $sort: { createdAt: -1 } });
      pipeline.push({ $skip: (parsedPage - 1) * parsedLimit });
      pipeline.push({ $limit: parsedLimit });

      pipeline.push({
        $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'company' },
      });
      pipeline.push({ $unwind: { path: '$company', preserveNullAndEmpty: true } });
      pipeline.push({
        $lookup: { from: 'properties', localField: 'propertyId', foreignField: '_id', as: 'property' },
      });
      pipeline.push({ $unwind: { path: '$property', preserveNullAndEmpty: true } });

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
      logger.logError('admin/listing/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await ListingModel.findById(id)
        .populate('propertyId')
        .populate('companyId', 'name logo phone domain')
        .populate('approvedBy', 'username fullName');

      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      return res.json({ success: true, data: listing });
    } catch (err) {
      logger.logError('admin/listing/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const approve = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await ListingModel.findById(id);
      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      const updated = await ListingModel.findByIdAndUpdate(
        id,
        {
          status: LISTING_STATUS.APPROVED,
          approvedAt: new Date(),
          approvedBy: req.admin._id,
          rejectReason: '',
        },
        { new: true }
      );

      await NotificationService.notifyListingStatus(updated, 'approved');

      return res.json({ success: true, message: Message.LISTING_APPROVED, data: updated });
    } catch (err) {
      logger.logError('admin/listing/approve', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const reject = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const listing = await ListingModel.findById(id);
      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      const updated = await ListingModel.findByIdAndUpdate(
        id,
        {
          status: LISTING_STATUS.REJECTED,
          rejectReason: reason || '',
        },
        { new: true }
      );

      await NotificationService.notifyListingStatus(updated, 'rejected');

      return res.json({ success: true, message: Message.LISTING_REJECTED, data: updated });
    } catch (err) {
      logger.logError('admin/listing/reject', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const remove = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await ListingModel.findByIdAndDelete(id);
      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }
      return res.json({ success: true, message: Message.LISTING_DELETED });
    } catch (err) {
      logger.logError('admin/listing/remove', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail, approve, reject, remove };
