const TokenUtil = require('../../utils/token');
const Message = require('../../message');
const { v4: uuidv4 } = require('uuid');

const MAX_FAILED_ATTEMPTS = 5;

const login = {
  v1: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const companyUser = await CompanyUserModel.findOne({
        username: username.toLowerCase().trim(),
      }).populate('companyId');

      if (!companyUser) {
        return res.json({ success: false, message: Message.ACCOUNT_NOT_FOUND });
      }

      if (!companyUser.isActive) {
        return res.json({ success: false, message: Message.ACCOUNT_LOCKED });
      }

      if (companyUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        return res.json({ success: false, message: Message.TOO_MANY_FAILED_ATTEMPTS });
      }

      if (!companyUser.comparePassword(password)) {
        await CompanyUserModel.findByIdAndUpdate(companyUser._id, {
          $inc: { failedLoginAttempts: 1 },
        });
        return res.json({ success: false, message: Message.PASSWORD_WRONG });
      }

      if (!companyUser.companyId || !companyUser.companyId.isActive) {
        return res.json({ success: false, message: Message.COMPANY_LOCKED });
      }

      // Reset failed attempts
      await CompanyUserModel.findByIdAndUpdate(companyUser._id, {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      });

      const token = TokenUtil.generateCompanyUserToken(companyUser._id);

      return res.json({
        success: true,
        message: Message.LOGIN_SUCCESS,
        data: {
          token,
          mustChangePassword: companyUser.mustChangePassword,
          companyUser: {
            _id: companyUser._id,
            username: companyUser.username,
            fullName: companyUser.fullName,
            role: companyUser.role,
          },
          company: {
            _id: companyUser.companyId._id,
            name: companyUser.companyId.name,
            logo: companyUser.companyId.logo,
            domain: companyUser.companyId.domain,
          },
        },
      });
    } catch (err) {
      logger.logError('companyAuth/login', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const logout = {
  v1: async (req, res) => {
    try {
      return res.json({ success: true, message: Message.LOGOUT_SUCCESS });
    } catch (err) {
      logger.logError('companyAuth/logout', err.message);
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

      if (!req.companyUser.comparePassword(currentPassword)) {
        return res.json({ success: false, message: Message.PASSWORD_WRONG });
      }

      if (newPassword.length < 6) {
        return res.json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      }

      const passwordHash = CompanyUserModel.hashPassword(newPassword);
      await CompanyUserModel.findByIdAndUpdate(req.companyUser._id, {
        passwordHash,
        mustChangePassword: false,
      });

      return res.json({ success: true, message: Message.PASSWORD_CHANGED });
    } catch (err) {
      logger.logError('companyAuth/changePassword', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const forgotPasswordRequest = {
  v1: async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const companyUser = await CompanyUserModel.findOne({ username: username.toLowerCase().trim() });
      if (!companyUser || !companyUser.isActive) {
        // Don't reveal if user exists
        return res.json({ success: true, message: 'Nếu tài khoản tồn tại, email đặt lại mật khẩu đã được gửi.' });
      }

      if (!companyUser.email) {
        return res.json({ success: false, message: 'Tài khoản không có email đăng ký' });
      }

      const token = uuidv4();
      const expiry = moment().add(30, 'minutes').toDate();

      await CompanyUserModel.findByIdAndUpdate(companyUser._id, {
        resetPasswordToken: token,
        resetPasswordExpiry: expiry,
      });

      const resetLink = `https://portal.bdshy.vn/reset-password?token=${token}`;
      await MailUtil.sendPasswordResetEmail(companyUser.email, resetLink);

      return res.json({ success: true, message: 'Email đặt lại mật khẩu đã được gửi.' });
    } catch (err) {
      logger.logError('companyAuth/forgotPasswordRequest', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const forgotPasswordConfirm = {
  v1: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const companyUser = await CompanyUserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: new Date() },
      });

      if (!companyUser) {
        return res.json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
      }

      if (newPassword.length < 6) {
        return res.json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      }

      const passwordHash = CompanyUserModel.hashPassword(newPassword);
      await CompanyUserModel.findByIdAndUpdate(companyUser._id, {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
        mustChangePassword: false,
      });

      return res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
    } catch (err) {
      logger.logError('companyAuth/forgotPasswordConfirm', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const changeFirstPassword = {
  v1: async (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      if (newPassword.length < 6) {
        return res.json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }

      const passwordHash = CompanyUserModel.hashPassword(newPassword);
      await CompanyUserModel.findByIdAndUpdate(req.companyUser._id, {
        passwordHash,
        mustChangePassword: false,
      });

      return res.json({ success: true, message: 'Đổi mật khẩu lần đầu thành công' });
    } catch (err) {
      logger.logError('companyAuth/changeFirstPassword', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = {
  login,
  logout,
  changePassword,
  forgotPasswordRequest,
  forgotPasswordConfirm,
  changeFirstPassword,
};
