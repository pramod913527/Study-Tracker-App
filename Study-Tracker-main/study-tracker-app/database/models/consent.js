// Phase DB-17 — Consent & GDPR Records (Mongoose Schema)

const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  givenAt: {
    type: Date,
    required: true
  },
  revokedAt: {
    type: Date
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('Consent', consentSchema);
