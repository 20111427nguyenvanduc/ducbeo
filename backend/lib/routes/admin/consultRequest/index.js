const Message = require('../../../message');
const { CONSULT_STATUS } = require('../../../const');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, companyId } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = {};
      if (status) query.status = status;
      if (companyId) query.companyId = companyId;

      const [requests, total] = await Promise.all([
        ConsultRequestModel.find(query)
          .populate('listingId', 'title')
          .populate('companyId', 'name')
          .populate('memberId', 'name phone')
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        ConsultRequestModel.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          requests,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('admin/consultRequest/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await ConsultRequestModel.findById(id)
        .populate('listingId')
        .populate('companyId', 'name phone')
        .populate('memberId', 'name phone email');

      if (!request) {
        return res.json({ success: false, message: Message.CONSULT_REQUEST_NOT_FOUND });
      }

      return res.json({ success: true, data: request });
    } catch (err) {
      logger.logError('admin/consultRequest/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const sendReminder = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await ConsultRequestModel.findById(id).populate('companyId');
      if (!request) {
        return res.json({ success: false, message: Message.CONSULT_REQUEST_NOT_FOUND });
      }

      if (request.companyId) {
        io.to(`company_${request.companyId._id}`).emit('consult_reminder', {
          requestId: request._id,
          type: 'admin_reminder',
          message: 'Admin đã gửi nhắc nhở cho đơn tư vấn này.',
        });
      }

      await ConsultRequestModel.findByIdAndUpdate(id, { reminderSentAt: new Date() });

      return res.json({ success: true, message: Message.REMINDER_SENT });
    } catch (err) {
      logger.logError('admin/consultRequest/sendReminder', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const statistics = {
  v1: async (req, res) => {
    try {
      const statusCounts = await ConsultRequestModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);

      const byStatus = {};
      statusCounts.forEach((s) => { byStatus[s._id] = s.count; });

      // By company (top 10)
      const byCompany = await ConsultRequestModel.aggregate([
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
        { $unwind: { path: '$company', preserveNullAndEmpty: true } },
        { $project: { companyName: '$company.name', count: 1 } },
      ]);

      // This month
      const thisMonthCount = await ConsultRequestModel.countDocuments({
        createdAt: { $gte: moment().startOf('month').toDate() },
      });

      return res.json({
        success: true,
        data: { byStatus, byCompany, thisMonth: thisMonthCount },
      });
    } catch (err) {
      logger.logError('admin/consultRequest/statistics', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail, sendReminder, statistics };
