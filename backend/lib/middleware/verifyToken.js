const TokenUtil = require('../utils/token');
const Message = require('../message');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.json({ success: false, message: Message.UNAUTHORIZED });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = TokenUtil.verifyAccessToken(token);

    if (!decoded) {
      return res.json({ success: false, message: Message.TOKEN_INVALID });
    }

    req.tokenData = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.json({ success: false, message: Message.TOKEN_EXPIRED });
    }
    return res.json({ success: false, message: Message.TOKEN_INVALID });
  }
};
