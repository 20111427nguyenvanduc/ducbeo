const { Schema } = mongoose;

const wardSchema = new Schema({
  districtCode: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
});

wardSchema.index({ districtCode: 1 });

module.exports = mongoose.model('ward', wardSchema);
