// Phase DB-13 — Settings / Org Policies (Mongoose Schema)

const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true,
    unique: true
  },
  proofPolicyDefault: {
    type: String,
    default: ''
  },
  lockWindows: {
    type: Object,
    default: {}
  },
  mediaRetentionDays: {
    type: Number,
    default: 30
  },
  notificationTemplates: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
