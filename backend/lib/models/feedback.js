const { Schema } = mongoose;
const { FEEDBACK_STATUS } = require('../const');

const feedbackSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'member' },
    memberPhone: { type: String, trim: true },
    memberName: { type: String, trim: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: [FEEDBACK_STATUS.NEW, FEEDBACK_STATUS.RESOLVED],
      default: FEEDBACK_STATUS.NEW,
    },
    adminNote: { type: String, default: '' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'admin' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('feedback', feedbackSchema);
