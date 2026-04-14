const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: _.get(config, 'smtp.host', process.env.SMTP_HOST || 'smtp.gmail.com'),
    port: _.get(config, 'smtp.port', process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: _.get(config, 'smtp.user', process.env.SMTP_USER || ''),
      pass: _.get(config, 'smtp.password', process.env.SMTP_PASSWORD || ''),
    },
  });
};

const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const from = _.get(config, 'smtp.from', process.env.EMAIL_FROM || 'noreply@bdshy.vn');

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });

    logger.logInfo('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.logError('Email error:', err.message);
    return { success: false, error: err.message };
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  return sendMail({
    to: email,
    subject: 'Đặt lại mật khẩu - Sàn BĐS Hưng Yên',
    html: `
      <h2>Đặt lại mật khẩu</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại Sàn BĐS Hưng Yên.</p>
      <p>Nhấn vào link bên dưới để đặt lại mật khẩu (có hiệu lực trong 30 phút):</p>
      <a href="${resetLink}" style="color: #007bff;">${resetLink}</a>
      <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
    `,
  });
};

module.exports = {
  sendMail,
  sendPasswordResetEmail,
};
