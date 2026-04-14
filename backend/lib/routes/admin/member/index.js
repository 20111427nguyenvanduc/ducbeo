const Message = require('../../../message');

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, keyword, isActive } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = {};
      if (keyword) {
        query.$or = [
          { phone: { $regex: keyword, $options: 'i' } },
          { name: { $regex: keyword, $options: 'i' } },
        ];
      }
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const [members, total] = await Promise.all([
        MemberModel.find(query)
          .select('-__v')
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        MemberModel.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          members,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('admin/member/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await MemberModel.findById(id);
      if (!member) {
        return res.json({ success: false, message: Message.MEMBER_NOT_FOUND });
      }
      return res.json({ success: true, data: member });
    } catch (err) {
      logger.logError('admin/member/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const lockUnlock = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await MemberModel.findById(id);
      if (!member) {
        return res.json({ success: false, message: Message.MEMBER_NOT_FOUND });
      }

      const newIsActive = !member.isActive;
      await MemberModel.findByIdAndUpdate(id, { isActive: newIsActive });

      return res.json({
        success: true,
        message: newIsActive ? Message.MEMBER_UNLOCKED : Message.MEMBER_LOCKED,
        data: { isActive: newIsActive },
      });
    } catch (err) {
      logger.logError('admin/member/lockUnlock', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const count = {
  v1: async (req, res) => {
    try {
      const [total, active, newThisMonth] = await Promise.all([
        MemberModel.countDocuments(),
        MemberModel.countDocuments({ isActive: true }),
        MemberModel.countDocuments({
          createdAt: { $gte: moment().startOf('month').toDate() },
        }),
      ]);

      return res.json({ success: true, data: { total, active, newThisMonth } });
    } catch (err) {
      logger.logError('admin/member/count', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, detail, lockUnlock, count };
