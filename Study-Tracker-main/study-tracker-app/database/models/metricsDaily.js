// Phase DB-12 — Reports / Aggregates Storage (Mongoose Schema)

const mongoose = require('mongoose');

const metricsDailySchema = new mongoose.Schema({
  missed: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  assigned: {
    type: Number,
    default: 0
  },
  completed: {
    type: Number,
    default: 0
  },
  onTime: {
    type: Number,
    default: 0
  },
  avgDelay: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: false
});

metricsDailySchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MetricsDaily', metricsDailySchema);
