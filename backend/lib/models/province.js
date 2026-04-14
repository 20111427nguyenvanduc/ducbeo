const { Schema } = mongoose;

const provinceSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
});

module.exports = mongoose.model('province', provinceSchema);
