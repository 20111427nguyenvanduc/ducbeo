const OtpService = require('../../services/otp');
const TokenUtil = require('../../utils/token');
const Message = require('../../message');

const sendOtp = {
  v1: async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.json({ success: false, message: Message.PHONE_REQUIRED });
      }

      const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        return res.json({ success: false, message: Message.INVALID_PHONE });
      }

      const result = await OtpService.sendOtp(phone);
      if (!result.success) {
        return res.json({ success: false, message: Message.SYSTEM_ERROR });
      }

      const response = { success: true, message: Message.OTP_SENT };
      if (result.otp) response.otp = result.otp; // dev mode only
      return res.json(response);
    } catch (err) {
      logger.logError('auth/sendOtp', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const verifyOtp = {
  v1: async (req, res) => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const isValid = OtpService.verifyOtp(phone, otp);
      if (!isValid) {
        return res.json({ success: false, message: Message.OTP_INVALID });
      }

      // Find or create member
      let member = await MemberModel.findOne({ phone });
      if (!member) {
        member = await MemberModel.create({ phone, isActive: true });
      }

      if (!member.isActive) {
        return res.json({ success: false, message: Message.ACCOUNT_LOCKED });
      }

      await MemberModel.findByIdAndUpdate(member._id, { lastLoginAt: new Date() });

      const token = TokenUtil.generateMemberToken(member._id);

      return res.json({
        success: true,
        message: Message.LOGIN_SUCCESS,
        data: {
          token,
          member: {
            _id: member._id,
            phone: member.phone,
            name: member.name,
            email: member.email,
            avatar: member.avatar,
          },
        },
      });
    } catch (err) {
      logger.logError('auth/verifyOtp', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const logout = {
  v1: async (req, res) => {
    try {
      return res.json({ success: true, message: Message.LOGOUT_SUCCESS });
    } catch (err) {
      logger.logError('auth/logout', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const changePassword = {
  v1: async (req, res) => {
    // Members use OTP-based auth, no password to change
    return res.json({ success: false, message: 'Chức năng này không khả dụng cho người dùng thường' });
  },
};

module.exports = { sendOtp, verifyOtp, logout, changePassword };
