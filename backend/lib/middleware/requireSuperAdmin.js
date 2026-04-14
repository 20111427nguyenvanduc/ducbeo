const Message = require('../message');
const { ADMIN_ROLE } = require('../const');

module.exports = (req, res, next) => {
  if (!req.admin || req.admin.role !== ADMIN_ROLE.SUPER_ADMIN) {
    return res.json({ success: false, message: Message.FORBIDDEN });
  }
  next();
};
