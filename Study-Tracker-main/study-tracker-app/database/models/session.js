// Phase DB-08 — Sessions (Materialized Instances) (Mongoose Schema)

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  plannedStartTs: {
    type: Date,
    required: true
  },
  plannedEndTs: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'started', 'mid-checked', 'completed', 'missed'],
    default: 'planned'
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

sessionSchema.index({ studentId: 1, date: 1 });

module.exports = mongoose.model('Session', sessionSchema);
