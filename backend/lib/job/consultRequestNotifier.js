const cron = require('node-cron');
const { CONSULT_STATUS } = require('../const');

const start = () => {
  // Every hour: check overdue consult requests
  cron.schedule('0 * * * *', async () => {
    try {
      logger.logInfo('[CRON] Running consultRequestNotifier');

      // Check waiting requests > 24h → send reminder
      const cutoff24h = moment().subtract(24, 'hours').toDate();
      const overdueWaiting = await ConsultRequestModel.find({
        status: CONSULT_STATUS.WAITING,
        createdAt: { $lt: cutoff24h },
        reminderSentAt: null,
      }).populate('companyId');

      for (const req of overdueWaiting) {
        if (!req.companyId) continue;

        // Emit socket to company
        io.to(`company_${req.companyId._id}`).emit('consult_reminder', {
          requestId: req._id,
          type: 'overdue_24h',
          message: 'Đơn tư vấn đã chờ hơn 24 giờ, vui lòng xử lý ngay.',
        });

        // Notify company users
        const companyUsers = await CompanyUserModel.find({
          companyId: req.companyId._id,
          isActive: true,
        });

        const NotificationService = require('../services/notification');
        for (const user of companyUsers) {
          await NotificationService.createAndEmit({
            recipientId: user._id,
            recipientType: 'company_user',
            type: 'consult_reminder',
            title: 'Đơn tư vấn chờ xử lý',
            content: `Đơn tư vấn #${req._id} đã chờ hơn 24 giờ, cần xử lý ngay.`,
            refId: req._id,
            refType: 'consultRequest',
          });
        }

        await ConsultRequestModel.findByIdAndUpdate(req._id, {
          reminderSentAt: new Date(),
        });
      }

      if (overdueWaiting.length > 0) {
        logger.logInfo(`[CRON] Sent 24h reminders for ${overdueWaiting.length} consult requests`);
      }

      // Check consulting requests > 72h → send warning
      const cutoff72h = moment().subtract(72, 'hours').toDate();
      const overdueConsulting = await ConsultRequestModel.find({
        status: CONSULT_STATUS.CONSULTING,
        updatedAt: { $lt: cutoff72h },
      }).populate('companyId');

      for (const req of overdueConsulting) {
        if (!req.companyId) continue;

        io.to(`company_${req.companyId._id}`).emit('consult_reminder', {
          requestId: req._id,
          type: 'overdue_72h',
          message: 'Đơn tư vấn đã trong trạng thái tư vấn hơn 72 giờ.',
        });
      }

      if (overdueConsulting.length > 0) {
        logger.logInfo(`[CRON] Sent 72h warnings for ${overdueConsulting.length} consult requests`);
      }
    } catch (err) {
      logger.logError('[CRON] consultRequestNotifier error:', err.message);
    }
  });

  // Daily at midnight: expire listings
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      const result = await ListingModel.updateMany(
        { status: 'approved', expiredAt: { $lt: now } },
        { status: 'expired' }
      );
      if (result.nModified > 0) {
        logger.logInfo(`[CRON] Expired ${result.nModified} listings`);
      }
    } catch (err) {
      logger.logError('[CRON] listing expiry error:', err.message);
    }
  });
};

module.exports = { start };
