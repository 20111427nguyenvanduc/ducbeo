const TokenUtil = require('../utils/token');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return next();

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = TokenUtil.verifyAccessToken(token);

    if (!decoded || decoded.type !== 'member') return next();

    const member = await MemberModel.findById(decoded.id);
    if (!member || !member.isActive) return next();

    req.member = member;
    next();
  } catch (err) {
    next();
  }
};
