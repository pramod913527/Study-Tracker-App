// Phase DB-03 — Roles & Role Grants (Mongoose Schema)

const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    default: null
  },
  grantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  grantedAt: {
    type: Date,
    default: Date.now
  }
});

userRoleSchema.index({ userId: 1, role: 1, orgId: 1 }, { unique: true });

module.exports = mongoose.model('UserRole', userRoleSchema);
