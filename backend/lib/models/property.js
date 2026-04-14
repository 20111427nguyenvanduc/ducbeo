const { Schema } = mongoose;
const { PROPERTY_TYPES, LEGAL_STATUS, TRANSACTION_TYPE, PROPERTY_STATUS } = require('../const');

const propertySchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    propertyTypeSlug: {
      type: String,
      required: true,
      enum: PROPERTY_TYPES,
    },
    transactionType: {
      type: String,
      required: true,
      enum: [TRANSACTION_TYPE.SELL, TRANSACTION_TYPE.RENT],
    },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    sellerPhone: { type: String, trim: true },
    legalStatus: {
      type: String,
      enum: [LEGAL_STATUS.SO_DO, LEGAL_STATUS.SO_HONG, LEGAL_STATUS.HOP_DONG, LEGAL_STATUS.CHO_SO],
    },
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    ward: { type: String, trim: true },
    addressDetail: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [{ type: String }],
    video: { type: String },
    dynamicFields: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: [PROPERTY_STATUS.ACTIVE, PROPERTY_STATUS.INACTIVE],
      default: PROPERTY_STATUS.ACTIVE,
    },
    createdByUserId: { type: Schema.Types.ObjectId, ref: 'companyUser' },
  },
  { timestamps: true }
);

propertySchema.index({ companyId: 1, status: 1 });
propertySchema.index({ propertyTypeSlug: 1, transactionType: 1 });

module.exports = mongoose.model('property', propertySchema);
