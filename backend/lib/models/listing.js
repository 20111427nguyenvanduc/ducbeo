const { Schema } = mongoose;
const { LISTING_STATUS } = require('../const');

const listingSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'property', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: [LISTING_STATUS.PENDING, LISTING_STATUS.APPROVED, LISTING_STATUS.REJECTED, LISTING_STATUS.EXPIRED],
      default: LISTING_STATUS.PENDING,
    },
    rejectReason: { type: String },
    expiredAt: { type: Date },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'admin' },
    viewCount: { type: Number, default: 0 },
    createdByUserId: { type: Schema.Types.ObjectId, ref: 'companyUser' },
  },
  { timestamps: true }
);

listingSchema.index({ companyId: 1, status: 1 });
listingSchema.index({ status: 1, expiredAt: 1 });

module.exports = mongoose.model('listing', listingSchema);
