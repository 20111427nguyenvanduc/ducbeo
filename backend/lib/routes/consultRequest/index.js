const Message = require('../../message');
const { LISTING_STATUS } = require('../../const');
const NotificationService = require('../../services/notification');

const create = {
  v1: async (req, res) => {
    try {
      const { listingId, note } = req.body;
      const member = req.member;

      if (!listingId) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const listing = await ListingModel.findOne({ _id: listingId, status: LISTING_STATUS.APPROVED });
      if (!listing) {
        return res.json({ success: false, message: Message.LISTING_NOT_FOUND });
      }

      const consultRequest = await ConsultRequestModel.create({
        listingId,
        companyId: listing.companyId,
        memberId: member._id,
        memberName: member.name || member.phone,
        memberPhone: member.phone,
        note: note || '',
        status: 'waiting',
        timeline: [
          {
            status: 'waiting',
            changedBy: member._id,
            changedByType: 'member',
            changedAt: new Date(),
          },
        ],
      });

      // Notify company
      await NotificationService.notifyNewConsultRequest(consultRequest);

      return res.json({
        success: true,
        message: Message.CONSULT_REQUEST_CREATED,
        data: consultRequest,
      });
    } catch (err) {
      logger.logError('consultRequest/create', err.message);
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

      const query = { memberId: req.member._id };
      if (status) query.status = status;

      const [requests, total] = await Promise.all([
        ConsultRequestModel.find(query)
          .populate('listingId', 'title')
          .populate('companyId', 'name logo phone')
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
      logger.logError('consultRequest/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await ConsultRequestModel.findOne({ _id: id, memberId: req.member._id })
        .populate('listingId')
        .populate('companyId', 'name logo phone address');

      if (!request) {
        return res.json({ success: false, message: Message.CONSULT_REQUEST_NOT_FOUND });
      }

      return res.json({ success: true, data: request });
    } catch (err) {
      logger.logError('consultRequest/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create, list, detail };
