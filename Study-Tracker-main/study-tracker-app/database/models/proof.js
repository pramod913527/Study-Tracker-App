// Phase DB-14 — Media / Proof Metadata (Mongoose Schema)

const mongoose = require('mongoose');

const proofSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  checksum: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  mime: {
    type: String,
    default: ''
  },
  expiry: {
    type: Date
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Proof', proofSchema);
