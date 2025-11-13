const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);