const { Schema } = mongoose;

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    link: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('banner', bannerSchema);
