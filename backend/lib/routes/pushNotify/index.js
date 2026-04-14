const Message = require('../../message');

const addToken = {
  v1: async (req, res) => {
    try {
      const { token, platform } = req.body;
      if (!token) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      await NotifyTokenModel.findOneAndUpdate(
        { token },
        { memberId: req.member._id, token, platform: platform || 'web' },
        { upsert: true, new: true }
      );

      return res.json({ success: true, message: 'Đăng ký nhận thông báo thành công' });
    } catch (err) {
      logger.logError('pushNotify/addToken', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { addToken };
