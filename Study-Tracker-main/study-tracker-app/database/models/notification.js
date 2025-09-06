// Phase DB-10 — Notifications & Delivery Logs (Mongoose Schema)

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'telegram', 'push', 'email'],
    required: true
  },
  templateId: {
    type: String,
    required: true
  },
  payload: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  failureReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

notificationSchema.index({ recipientId: 1, sentAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
