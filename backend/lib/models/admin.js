const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { ADMIN_ROLE } = require('../const');

const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, trim: true, default: '' },
    role: { type: String, enum: [ADMIN_ROLE.ADMIN, ADMIN_ROLE.SUPER_ADMIN], default: ADMIN_ROLE.ADMIN },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

adminSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('admin', adminSchema);
