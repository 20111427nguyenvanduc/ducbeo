const { Schema } = mongoose;

const notifyTokenSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'member', required: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['ios', 'android', 'web'], default: 'web' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('notifyToken', notifyTokenSchema);
