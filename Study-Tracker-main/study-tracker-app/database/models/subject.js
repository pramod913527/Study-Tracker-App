// Phase DB-05 — Subjects & Tags (Mongoose Schema)

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#000000'
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

subjectSchema.index({ orgId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
