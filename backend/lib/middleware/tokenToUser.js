const TokenUtil = require('../utils/token');
const Message = require('../message');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.json({ success: false, message: Message.UNAUTHORIZED });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = TokenUtil.verifyAccessToken(token);

    if (!decoded || decoded.type !== 'member') {
      return res.json({ success: false, message: Message.TOKEN_INVALID });
    }

    const member = await MemberModel.findById(decoded.id);
    if (!member) {
      return res.json({ success: false, message: Message.MEMBER_NOT_FOUND });
    }

    if (!member.isActive) {
      return res.json({ success: false, message: Message.ACCOUNT_LOCKED });
    }

    req.member = member;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.json({ success: false, message: Message.TOKEN_EXPIRED });
    }
    return res.json({ success: false, message: Message.TOKEN_INVALID });
  }
};
