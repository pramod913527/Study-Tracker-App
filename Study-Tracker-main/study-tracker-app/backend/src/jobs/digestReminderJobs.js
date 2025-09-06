// Digest & Reminder Jobs: pre-slot reminders, post-slot missed checks, nightly digests (mocked)
const { NotificationService, WhatsAppAdapter, TelegramAdapter, EmailAdapter } = require('../services/notificationService');
const mongoose = require('mongoose');

// Singleton notification service for jobs
const notificationService = new NotificationService();
notificationService.registerAdapter(new WhatsAppAdapter());
notificationService.registerAdapter(new TelegramAdapter());
notificationService.registerAdapter(new EmailAdapter());

// Mocked Session model for demonstration (replace with real model in prod)
let Session;

function setSessionModel(model) {
  Session = model;
}

// Pre-slot reminder job
async function sendPreSlotReminders() {
  if (!Session) throw new Error('Session model not set');
  // Find sessions starting in next 15 min
  const now = new Date();
  const soon = new Date(now.getTime() + 15 * 60 * 1000);
  const sessions = await Session.find({ plannedStartTs: { $gte: now, $lte: soon }, status: 'planned' });
  for (const session of sessions) {
    await notificationService.send({
      to: session.studentId,
      message: `Reminder: Your session starts soon!`,
      type: 'reminder',
      sessionId: session._id
    });
  }
}

// Post-slot missed check job
async function sendMissedSessionChecks() {
  if (!Session) throw new Error('Session model not set');
  // Find sessions that ended in last 1 hour and are still not completed
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const sessions = await Session.find({ plannedEndTs: { $gte: hourAgo, $lte: now }, status: { $ne: 'completed' } });
  for (const session of sessions) {
    await notificationService.send({
      to: session.studentId,
      message: `You missed your session!`,
      type: 'missed',
      sessionId: session._id
    });
  }
}

// Nightly digest job
async function sendNightlyDigests() {
  if (!Session) throw new Error('Session model not set');
  // Find all sessions for today
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const sessions = await Session.find({ plannedStartTs: { $gte: today, $lt: tomorrow } });
  // Group by student
  const byStudent = {};
  for (const session of sessions) {
    if (!byStudent[session.studentId]) byStudent[session.studentId] = [];
    byStudent[session.studentId].push(session);
  }
  for (const studentId in byStudent) {
    await notificationService.send({
      to: studentId,
      message: `Your daily digest: ${byStudent[studentId].length} sessions today`,
      type: 'digest',
      sessions: byStudent[studentId]
    });
  }
}

module.exports = {
  setSessionModel,
  sendPreSlotReminders,
  sendMissedSessionChecks,
  sendNightlyDigests
};
