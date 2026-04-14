const Message = require('../../../message');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = {};
      if (status) query.status = status;

      const [requests, total] = await Promise.all([
        ConsignRequestModel.find(query)
          .populate('memberId', 'name phone')
          .populate('assignedCompanyId', 'name')
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        ConsignRequestModel.countDocuments(query),
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
      logger.logError('admin/consignRequest/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await ConsignRequestModel.findById(id)
        .populate('memberId', 'name phone email')
        .populate('assignedCompanyId', 'name phone');

      if (!request) {
        return res.json({ success: false, message: Message.CONSIGN_REQUEST_NOT_FOUND });
      }

      return res.json({ success: true, data: request });
    } catch (err) {
      logger.logError('admin/consignRequest/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const updateStatus = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNote, assignedCompanyId } = req.body;

      const validStatuses = ['new', 'processing', 'completed', 'rejected'];
      if (!status || !validStatuses.includes(status)) {
        return res.json({ success: false, message: 'Trạng thái không hợp lệ' });
      }

      const updateData = { status };
      if (adminNote !== undefined) updateData.adminNote = adminNote;
      if (assignedCompanyId !== undefined) updateData.assignedCompanyId = assignedCompanyId;

      const request = await ConsignRequestModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!request) {
        return res.json({ success: false, message: Message.CONSIGN_REQUEST_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.CONSIGN_REQUEST_UPDATED, data: request });
    } catch (err) {
      logger.logError('admin/consignRequest/updateStatus', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail, updateStatus };
