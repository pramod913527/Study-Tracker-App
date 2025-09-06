// Phase DB-18 — Subscriptions (Mongoose Schema)

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
