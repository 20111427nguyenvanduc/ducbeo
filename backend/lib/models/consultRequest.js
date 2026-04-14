const { Schema } = mongoose;
const { CONSULT_STATUS } = require('../const');

const consultRequestSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: 'listing', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'member', required: true },
    memberName: { type: String, trim: true },
    memberPhone: { type: String, trim: true },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        CONSULT_STATUS.WAITING,
        CONSULT_STATUS.CONSULTING,
        CONSULT_STATUS.APPOINTMENT,
        CONSULT_STATUS.TRANSFERRING,
        CONSULT_STATUS.WAITING_DOC,
        CONSULT_STATUS.COMPLETED,
      ],
      default: CONSULT_STATUS.WAITING,
    },
    internalNotes: [
      {
        content: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'companyUser' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        status: { type: String },
        changedBy: { type: Schema.Types.ObjectId },
        changedByType: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],
    reminderSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

consultRequestSchema.index({ companyId: 1, status: 1 });
consultRequestSchema.index({ memberId: 1, createdAt: -1 });

module.exports = mongoose.model('consultRequest', consultRequestSchema);
