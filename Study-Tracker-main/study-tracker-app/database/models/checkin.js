// Phase DB-09 — Checkins & Evidence (Mongoose Schema)

const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['start', 'mid', 'complete'],
    required: true
  },
  serverTs: {
    type: Date,
    default: Date.now
  },
  deviceMeta: {
    type: Object,
    default: {}
  },
  proofUrls: {
    type: [String],
    default: []
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: false
});

checkinSchema.index({ sessionId: 1, serverTs: 1 });

module.exports = mongoose.model('Checkin', checkinSchema);
