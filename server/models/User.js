const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // null for Google users
  name: { type: String },
  avatar: { type: String },
  googleId: { type: String }, // for Google OAuth
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);