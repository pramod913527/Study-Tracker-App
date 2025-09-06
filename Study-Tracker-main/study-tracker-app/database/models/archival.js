// Phase DB-20 — Archival + Retention Policy Implementation (Mongoose Schema)

const mongoose = require('mongoose');

const archivalSchema = new mongoose.Schema({
  collection: {
    type: String,
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  archivedAt: {
    type: Date,
    default: Date.now
  },
  restoreAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Archival', archivalSchema);
