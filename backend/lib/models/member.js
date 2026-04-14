const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    avatar: { type: String, default: '' },
    dob: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    address: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('member', memberSchema);
