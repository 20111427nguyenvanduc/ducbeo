const Message = require('../../message');
const { USER_TYPE } = require('../../const');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = { recipientId: req.member._id, recipientType: USER_TYPE.MEMBER };

      const [notifications, total] = await Promise.all([
        NotificationModel.find(query)
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        NotificationModel.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          notifications,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('notification/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const seen = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await NotificationModel.findOneAndUpdate(
        { _id: id, recipientId: req.member._id },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.json({ success: false, message: Message.NOTIFICATION_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.NOTIFICATION_SEEN });
    } catch (err) {
      logger.logError('notification/seen', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const seenAll = {
  v1: async (req, res) => {
    try {
      await NotificationModel.updateMany(
        { recipientId: req.member._id, isRead: false },
        { isRead: true }
      );
      return res.json({ success: true, message: Message.NOTIFICATION_SEEN_ALL });
    } catch (err) {
      logger.logError('notification/seenAll', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const count = {
  v1: async (req, res) => {
    try {
      const unreadCount = await NotificationModel.countDocuments({
        recipientId: req.member._id,
        isRead: false,
      });
      return res.json({ success: true, data: { unreadCount } });
    } catch (err) {
      logger.logError('notification/count', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, seen, seenAll, count };
