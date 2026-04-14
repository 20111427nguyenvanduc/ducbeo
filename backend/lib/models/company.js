const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, default: '' },
    logo: { type: String, default: '' },
    domain: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    description: { type: String, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('company', companySchema);
