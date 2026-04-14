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

    if (!decoded || decoded.type !== 'company_user') {
      return res.json({ success: false, message: Message.TOKEN_INVALID });
    }

    const companyUser = await CompanyUserModel.findById(decoded.id).populate('companyId');
    if (!companyUser) {
      return res.json({ success: false, message: Message.ACCOUNT_NOT_FOUND });
    }

    if (!companyUser.isActive) {
      return res.json({ success: false, message: Message.ACCOUNT_LOCKED });
    }

    if (!companyUser.companyId || !companyUser.companyId.isActive) {
      return res.json({ success: false, message: Message.COMPANY_LOCKED });
    }

    req.companyUser = companyUser;
    req.company = companyUser.companyId;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.json({ success: false, message: Message.TOKEN_EXPIRED });
    }
    return res.json({ success: false, message: Message.TOKEN_INVALID });
  }
};
