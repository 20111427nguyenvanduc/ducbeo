const TokenUtil = require('../../../utils/token');
const Message = require('../../../message');

const MAX_FAILED_ATTEMPTS = 10;

const login = {
  v1: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const admin = await AdminModel.findOne({ username: username.toLowerCase().trim() });
      if (!admin) {
        return res.json({ success: false, message: Message.ACCOUNT_NOT_FOUND });
      }

      if (!admin.isActive) {
        return res.json({ success: false, message: Message.ACCOUNT_LOCKED });
      }

      if (!admin.comparePassword(password)) {
        return res.json({ success: false, message: Message.PASSWORD_WRONG });
      }

      await AdminModel.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() });

      const token = TokenUtil.generateAdminToken(admin._id);

      return res.json({
        success: true,
        message: Message.LOGIN_SUCCESS,
        data: {
          token,
          admin: {
            _id: admin._id,
            username: admin.username,
            fullName: admin.fullName,
            role: admin.role,
          },
        },
      });
    } catch (err) {
      logger.logError('admin/auth/login', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const logout = {
  v1: async (req, res) => {
    try {
      return res.json({ success: true, message: Message.LOGOUT_SUCCESS });
    } catch (err) {
      logger.logError('admin/auth/logout', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const changePassword = {
  v1: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      if (!req.admin.comparePassword(currentPassword)) {
        return res.json({ success: false, message: Message.PASSWORD_WRONG });
      }

      if (newPassword.length < 6) {
        return res.json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      }

      const passwordHash = AdminModel.hashPassword(newPassword);
      await AdminModel.findByIdAndUpdate(req.admin._id, { passwordHash });

      return res.json({ success: true, message: Message.PASSWORD_CHANGED });
    } catch (err) {
      logger.logError('admin/auth/changePassword', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const get = {
  v1: async (req, res) => {
    try {
      return res.json({
        success: true,
        data: {
          _id: req.admin._id,
          username: req.admin.username,
          fullName: req.admin.fullName,
          role: req.admin.role,
        },
      });
    } catch (err) {
      logger.logError('admin/auth/get', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { login, logout, changePassword, get };
