const { Schema } = mongoose;
const { PROPERTY_TYPES, TRANSACTION_TYPE, CONSIGN_STATUS } = require('../const');

const consignRequestSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'member', required: true },
    memberName: { type: String, trim: true },
    memberPhone: { type: String, trim: true },
    propertyTypeSlug: { type: String, enum: PROPERTY_TYPES },
    transactionType: { type: String, enum: [TRANSACTION_TYPE.SELL, TRANSACTION_TYPE.RENT] },
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    ward: { type: String, trim: true },
    addressDetail: { type: String, trim: true },
    area: { type: Number },
    price: { type: Number },
    description: { type: String, default: '' },
    images: [{ type: String }],
    status: {
      type: String,
      enum: [CONSIGN_STATUS.NEW, CONSIGN_STATUS.PROCESSING, CONSIGN_STATUS.COMPLETED, CONSIGN_STATUS.REJECTED],
      default: CONSIGN_STATUS.NEW,
    },
    adminNote: { type: String, default: '' },
    assignedCompanyId: { type: Schema.Types.ObjectId, ref: 'company' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('consignRequest', consignRequestSchema);
