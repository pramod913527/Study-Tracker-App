// Phase DB-11 — Audit Logs & Activity Trail (Mongoose Schema)

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  before: {
    type: Object,
    default: {}
  },
  after: {
    type: Object,
    default: {}
  },
  ts: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
