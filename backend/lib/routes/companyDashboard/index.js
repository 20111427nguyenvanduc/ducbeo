const Message = require('../../message');
const { CONSULT_STATUS, LISTING_STATUS } = require('../../const');

const stats = {
  v1: async (req, res) => {
    try {
      const companyId = req.company._id;

      const [
        totalProperties,
        activeProperties,
        totalListings,
        pendingListings,
        approvedListings,
        totalConsultRequests,
        waitingConsultRequests,
        processingConsultRequests,
      ] = await Promise.all([
        PropertyModel.countDocuments({ companyId }),
        PropertyModel.countDocuments({ companyId, status: 'active' }),
        ListingModel.countDocuments({ companyId }),
        ListingModel.countDocuments({ companyId, status: LISTING_STATUS.PENDING }),
        ListingModel.countDocuments({ companyId, status: LISTING_STATUS.APPROVED }),
        ConsultRequestModel.countDocuments({ companyId }),
        ConsultRequestModel.countDocuments({ companyId, status: CONSULT_STATUS.WAITING }),
        ConsultRequestModel.countDocuments({
          companyId,
          status: { $in: [CONSULT_STATUS.CONSULTING, CONSULT_STATUS.APPOINTMENT, CONSULT_STATUS.TRANSFERRING, CONSULT_STATUS.WAITING_DOC] },
        }),
      ]);

      // Recent consult requests (last 7 days)
      const last7Days = moment().subtract(7, 'days').toDate();
      const recentRequests = await ConsultRequestModel.find({
        companyId,
        createdAt: { $gte: last7Days },
        status: CONSULT_STATUS.WAITING,
      })
        .populate('listingId', 'title')
        .populate('memberId', 'name phone')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        data: {
          properties: {
            total: totalProperties,
            active: activeProperties,
          },
          listings: {
            total: totalListings,
            pending: pendingListings,
            approved: approvedListings,
          },
          consultRequests: {
            total: totalConsultRequests,
            waiting: waitingConsultRequests,
            processing: processingConsultRequests,
          },
          recentRequests,
        },
      });
    } catch (err) {
      logger.logError('companyDashboard/stats', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { stats };
