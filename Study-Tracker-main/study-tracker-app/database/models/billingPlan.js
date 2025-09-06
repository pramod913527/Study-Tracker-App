// Phase DB-18 — Billing & Plan Data (Mongoose Schema)

const mongoose = require('mongoose');

const billingPlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true
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

module.exports = mongoose.model('BillingPlan', billingPlanSchema);
