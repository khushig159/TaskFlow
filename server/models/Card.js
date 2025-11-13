const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  position: { type: Number, default: 0 },
  dueDate: { type: Date },
  labels: [{ type: String }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);2