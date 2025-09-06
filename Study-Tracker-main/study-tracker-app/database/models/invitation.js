// Phase DB-04 — Invitations / Onboarding Tokens (Mongoose Schema)

const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteeContact: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['developer', 'admin', 'mentor', 'teacher', 'parent', 'guardian', 'student']
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired', 'revoked'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

invitationSchema.index({ token: 1 }, { unique: true });

module.exports = mongoose.model('Invitation', invitationSchema);
