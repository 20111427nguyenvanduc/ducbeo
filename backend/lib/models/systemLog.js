const { Schema } = mongoose;
const { USER_TYPE } = require('../const');

const systemLogSchema = new Schema(
  {
    action: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId },
    userType: { type: String, enum: [USER_TYPE.MEMBER, USER_TYPE.COMPANY_USER, USER_TYPE.ADMIN] },
    details: { type: Schema.Types.Mixed },
    ip: { type: String },
  },
  { timestamps: true }
);

systemLogSchema.index({ userId: 1, createdAt: -1 });
systemLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('systemLog', systemLogSchema);
