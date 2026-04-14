const { Schema } = mongoose;
const { NOTIFICATION_TYPE, USER_TYPE } = require('../const');

const notificationSchema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true },
    recipientType: { type: String, enum: [USER_TYPE.MEMBER, USER_TYPE.COMPANY_USER, USER_TYPE.ADMIN], required: true },
    type: {
      type: String,
      enum: [
        NOTIFICATION_TYPE.CONSULT_REQUEST,
        NOTIFICATION_TYPE.CONSULT_REMINDER,
        NOTIFICATION_TYPE.LISTING_APPROVED,
        NOTIFICATION_TYPE.LISTING_REJECTED,
        NOTIFICATION_TYPE.LISTING_EXPIRED,
        NOTIFICATION_TYPE.CONSIGN_STATUS,
      ],
    },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    refId: { type: Schema.Types.ObjectId },
    refType: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('notification', notificationSchema);
