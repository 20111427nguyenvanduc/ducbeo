const { NOTIFICATION_TYPE, USER_TYPE } = require('../const');

/**
 * Create a notification record and emit via Socket.io
 */
const createAndEmit = async ({ recipientId, recipientType, type, title, content, refId, refType }) => {
  try {
    const notification = await NotificationModel.create({
      recipientId,
      recipientType,
      type,
      title,
      content,
      refId,
      refType,
    });

    // Emit to the correct socket room
    let room;
    if (recipientType === USER_TYPE.MEMBER) {
      room = `member_${recipientId}`;
    } else if (recipientType === USER_TYPE.COMPANY_USER) {
      room = `company_user_${recipientId}`;
    } else if (recipientType === USER_TYPE.ADMIN) {
      room = `admin_${recipientId}`;
    }

    if (room) {
      io.to(room).emit('notification', {
        id: notification._id,
        type,
        title,
        content,
        refId,
        refType,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (err) {
    logger.logError('notification/createAndEmit error:', err.message);
    return null;
  }
};

/**
 * Notify company about new consult request
 */
const notifyNewConsultRequest = async (consultRequest) => {
  const companyUsers = await CompanyUserModel.find({
    companyId: consultRequest.companyId,
    isActive: true,
  });

  for (const user of companyUsers) {
    await createAndEmit({
      recipientId: user._id,
      recipientType: USER_TYPE.COMPANY_USER,
      type: NOTIFICATION_TYPE.CONSULT_REQUEST,
      title: 'Đơn tư vấn mới',
      content: `Khách hàng ${consultRequest.memberName || consultRequest.memberPhone} vừa gửi đơn tư vấn.`,
      refId: consultRequest._id,
      refType: 'consultRequest',
    });
  }

  // Also emit to company room
  io.to(`company_${consultRequest.companyId}`).emit('consult_request_new', {
    requestId: consultRequest._id,
  });
};

/**
 * Notify member about listing approval/rejection
 */
const notifyListingStatus = async (listing, status) => {
  const property = await PropertyModel.findById(listing.propertyId);
  if (!property) return;

  const company = await CompanyModel.findById(listing.companyId);
  if (!company) return;

  const type = status === 'approved' ? NOTIFICATION_TYPE.LISTING_APPROVED : NOTIFICATION_TYPE.LISTING_REJECTED;
  const title = status === 'approved' ? 'Tin đăng được duyệt' : 'Tin đăng bị từ chối';
  const content = status === 'approved'
    ? `Tin đăng "${listing.title}" đã được duyệt và hiển thị trên sàn.`
    : `Tin đăng "${listing.title}" đã bị từ chối.`;

  // Notify company users
  const companyUsers = await CompanyUserModel.find({ companyId: listing.companyId, isActive: true });
  for (const user of companyUsers) {
    await createAndEmit({
      recipientId: user._id,
      recipientType: USER_TYPE.COMPANY_USER,
      type,
      title,
      content,
      refId: listing._id,
      refType: 'listing',
    });
  }
};

module.exports = {
  createAndEmit,
  notifyNewConsultRequest,
  notifyListingStatus,
};
