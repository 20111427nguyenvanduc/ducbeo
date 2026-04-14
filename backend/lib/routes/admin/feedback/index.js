const Message = require('../../../message');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = {};
      if (status) query.status = status;

      const [feedbacks, total] = await Promise.all([
        FeedbackModel.find(query)
          .populate('memberId', 'name phone')
          .populate('resolvedBy', 'username fullName')
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        FeedbackModel.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          feedbacks,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('admin/feedback/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const feedback = await FeedbackModel.findById(id)
        .populate('memberId', 'name phone email')
        .populate('resolvedBy', 'username fullName');

      if (!feedback) {
        return res.json({ success: false, message: Message.FEEDBACK_NOT_FOUND });
      }

      return res.json({ success: true, data: feedback });
    } catch (err) {
      logger.logError('admin/feedback/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const resolve = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;

      const feedback = await FeedbackModel.findByIdAndUpdate(
        id,
        {
          status: 'resolved',
          adminNote: adminNote || '',
          resolvedBy: req.admin._id,
          resolvedAt: new Date(),
        },
        { new: true }
      );

      if (!feedback) {
        return res.json({ success: false, message: Message.FEEDBACK_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.FEEDBACK_RESOLVED, data: feedback });
    } catch (err) {
      logger.logError('admin/feedback/resolve', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail, resolve };
