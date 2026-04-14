const Message = require('../../../message');
const { LISTING_STATUS, CONSULT_STATUS } = require('../../../const');

const stats = {
  v1: async (req, res) => {
    try {
      const [
        totalMembers,
        activeMembers,
        totalCompanies,
        activeCompanies,
        totalListings,
        pendingListings,
        approvedListings,
        totalConsultRequests,
        waitingConsultRequests,
        totalConsignRequests,
        newConsignRequests,
      ] = await Promise.all([
        MemberModel.countDocuments(),
        MemberModel.countDocuments({ isActive: true }),
        CompanyModel.countDocuments(),
        CompanyModel.countDocuments({ isActive: true }),
        ListingModel.countDocuments(),
        ListingModel.countDocuments({ status: LISTING_STATUS.PENDING }),
        ListingModel.countDocuments({ status: LISTING_STATUS.APPROVED }),
        ConsultRequestModel.countDocuments(),
        ConsultRequestModel.countDocuments({ status: CONSULT_STATUS.WAITING }),
        ConsignRequestModel.countDocuments(),
        ConsignRequestModel.countDocuments({ status: 'new' }),
      ]);

      // New members this month
      const thisMonthStart = moment().startOf('month').toDate();
      const newMembersThisMonth = await MemberModel.countDocuments({
        createdAt: { $gte: thisMonthStart },
      });

      // New consult requests this month
      const newConsultThisMonth = await ConsultRequestModel.countDocuments({
        createdAt: { $gte: thisMonthStart },
      });

      // Top companies by consult requests
      const topCompanies = await ConsultRequestModel.aggregate([
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
        { $unwind: { path: '$company', preserveNullAndEmpty: true } },
        { $project: { companyName: '$company.name', count: 1 } },
      ]);

      return res.json({
        success: true,
        data: {
          members: { total: totalMembers, active: activeMembers, newThisMonth: newMembersThisMonth },
          companies: { total: totalCompanies, active: activeCompanies },
          listings: { total: totalListings, pending: pendingListings, approved: approvedListings },
          consultRequests: { total: totalConsultRequests, waiting: waitingConsultRequests, newThisMonth: newConsultThisMonth },
          consignRequests: { total: totalConsignRequests, new: newConsignRequests },
          topCompanies,
        },
      });
    } catch (err) {
      logger.logError('admin/dashboard/stats', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { stats };
