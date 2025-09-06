// Phase DB-16 — Device & Session Metadata (Mongoose Schema)

const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    default: ''
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  deviceTrustFlag: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: false
});

deviceSchema.index({ userId: 1 });

module.exports = mongoose.model('Device', deviceSchema);
