// Note: `_` (lodash), `config`, `logger`, `moment` are set as globals in index.js before this module is used.
const twilio = require('twilio');

const getClient = () => {
  const accountSid = _.get(config, 'twilio.accountSid', process.env.TWILIO_ACCOUNT_SID || '');
  const authToken = _.get(config, 'twilio.authToken', process.env.TWILIO_AUTH_TOKEN || '');
  return twilio(accountSid, authToken);
};

// In-memory OTP store for development (use Redis in production)
const otpStore = new Map();

const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const sendOtp = async (phone) => {
  const otp = generateOtp();
  const expireMinutes = _.get(config, 'otp.expireMinutes', 5);
  const expireAt = moment().add(expireMinutes, 'minutes').toDate();

  otpStore.set(phone, { otp, expireAt });

  const twilioPhone = _.get(config, 'twilio.phoneNumber', process.env.TWILIO_PHONE_NUMBER || '');

  try {
    if (twilioPhone) {
      const client = getClient();
      await client.messages.create({
        body: `[BDS HY] Ma OTP cua ban la: ${otp}. Co hieu luc trong ${expireMinutes} phut.`,
        from: twilioPhone,
        to: phone,
      });
    } else {
      // Development mode: log OTP
      logger.logInfo(`[OTP DEV] Phone: ${phone}, OTP: ${otp}`);
    }

    return { success: true, otp: process.env.NODE_ENV !== 'production' ? otp : undefined };
  } catch (err) {
    logger.logError('OTP send error:', err.message);
    return { success: false, error: err.message };
  }
};

const verifyOtp = (phone, otp) => {
  const stored = otpStore.get(phone);
  if (!stored) return false;

  if (moment().isAfter(stored.expireAt)) {
    otpStore.delete(phone);
    return false;
  }

  if (stored.otp !== otp) return false;

  otpStore.delete(phone);
  return true;
};

module.exports = {
  sendOtp,
  verifyOtp,
};
