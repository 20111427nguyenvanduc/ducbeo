const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const companyUserSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    username: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    role: { type: String, enum: ['owner', 'staff'], default: 'staff' },
    mustChangePassword: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  { timestamps: true }
);

companyUserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

companyUserSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('companyUser', companyUserSchema);
