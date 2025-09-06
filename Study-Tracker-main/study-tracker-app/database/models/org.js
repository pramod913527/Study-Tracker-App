// Phase DB-02 — Orgs & Tenancy (Mongoose Schema)

const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  branding: {
    type: Object,
    default: {}
  },
  settings: {
    type: Object,
    default: {}
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

orgSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Org', orgSchema);
