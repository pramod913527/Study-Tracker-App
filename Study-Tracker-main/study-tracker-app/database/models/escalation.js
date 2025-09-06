// Phase DB-15 — Escalations & Rules Engine (Mongoose Schema)

const mongoose = require('mongoose');

const escalationSchema = new mongoose.Schema({
  trigger: {
    type: String,
    required: true
  },
  conditions: {
    type: Object,
    default: {}
  },
  actions: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Escalation', escalationSchema);
