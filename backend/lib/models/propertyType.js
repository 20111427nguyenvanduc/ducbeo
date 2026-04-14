const { Schema } = mongoose;

const propertyTypeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    icon: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('propertyType', propertyTypeSchema);
