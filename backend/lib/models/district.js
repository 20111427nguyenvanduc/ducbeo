const { Schema } = mongoose;

const districtSchema = new Schema({
  provinceCode: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
});

districtSchema.index({ provinceCode: 1 });

module.exports = mongoose.model('district', districtSchema);
