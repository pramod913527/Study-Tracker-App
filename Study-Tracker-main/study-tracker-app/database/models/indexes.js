// Phase DB-19 — Index/Performance Harden (Compound Indexes)

const mongoose = require('mongoose');
const Session = require('./session');
const Checkin = require('./checkin');
const Notification = require('./notification');

// Compound indexes for performance
Session.schema.index({ studentId: 1, date: 1 });
Checkin.schema.index({ sessionId: 1, serverTs: 1 });
Notification.schema.index({ recipientId: 1, sentAt: 1 });

// This file is for reference; indexes are applied in their respective models as well.

module.exports = {};
