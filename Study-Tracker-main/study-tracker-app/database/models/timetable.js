// Phase DB-06 — Timetables & Templates (Mongoose Schema)

const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  visibility: {
    type: String,
    enum: ['private', 'invited', 'org'],
    default: 'private'
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    default: null
  },
  tz: {
    type: String,
    default: 'Asia/Kolkata'
  },
  settings: {
    type: Object,
    default: {}
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

timetableSchema.index({ ownerId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
