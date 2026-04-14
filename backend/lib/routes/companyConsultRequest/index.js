const Message = require('../../message');
const { CONSULT_STATUS } = require('../../const');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = { companyId: req.company._id };
      if (status) query.status = status;

      const [requests, total] = await Promise.all([
        ConsultRequestModel.find(query)
          .populate('listingId', 'title')
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
      logger.logError('companyConsultRequest/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await ConsultRequestModel.findOne({ _id: id, companyId: req.company._id })
        .populate('listingId')
        .populate('memberId', 'name phone email');

      if (!request) {
        return res.json({ success: false, message: Message.CONSULT_REQUEST_NOT_FOUND });
      }

      return res.json({ success: true, data: request });
    } catch (err) {
      logger.logError('companyConsultRequest/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const updateStatus = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = Object.values(CONSULT_STATUS);
      if (!status || !validStatuses.includes(status)) {
        return res.json({ success: false, message: 'Trạng thái không hợp lệ' });
      }

      const request = await ConsultRequestModel.findOne({ _id: id, companyId: req.company._id });
      if (!request) {
        return res.json({ success: false, message: Message.CONSULT_REQUEST_NOT_FOUND });
      }

      const timelineEntry = {
        status,
        changedBy: req.companyUser._id,
        changedByType: 'company_user',
        changedAt: new Date(),
      };

      const updated = await ConsultRequestModel.findByIdAndUpdate(
        id,
        {
          status,
          $push: { timeline: timelineEntry },
        },
        { new: true }
      );

      return res.json({ success: true, message: Message.CONSULT_REQUEST_UPDATED, data: updated });
    } catch (err) {
      logger.logError('companyConsultRequest/updateStatus', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const addNote = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const request = await ConsultRequestModel.findOne({ _id: id, companyId: req.company._id });
      if (!request) {
        return res.json({ success: false, message: Message.CONSULT_REQUEST_NOT_FOUND });
      }

      const note = {
        content,
        createdBy: req.companyUser._id,
        createdAt: new Date(),
      };

      const updated = await ConsultRequestModel.findByIdAndUpdate(
        id,
        { $push: { internalNotes: note } },
        { new: true }
      );

      return res.json({ success: true, message: Message.CONSULT_REQUEST_NOTE_ADDED, data: updated });
    } catch (err) {
      logger.logError('companyConsultRequest/addNote', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail, updateStatus, addNote };
