const mongoose = require('mongoose');
const { setSessionModel, sendPreSlotReminders, sendMissedSessionChecks, sendNightlyDigests } = require('../jobs/digestReminderJobs');
const { NotificationService } = require('../services/notificationService');

describe('Digest & Reminder Jobs', () => {
  let Session, notificationService;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
    Session = mongoose.model('Session', require('../../../database/models/session').schema);
    setSessionModel(Session);
    notificationService = new NotificationService();
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    await Session.deleteMany({});
  });

  it('should enqueue pre-slot reminders for upcoming sessions', async () => {
    const studentId = new mongoose.Types.ObjectId();
    await Session.create({
      slotId: new mongoose.Types.ObjectId(),
      date: '2025-09-05',
      plannedStartTs: new Date(Date.now() + 10 * 60 * 1000),
      plannedEndTs: new Date(Date.now() + 70 * 60 * 1000),
      orgId: new mongoose.Types.ObjectId(),
      studentId,
      status: 'planned'
    });
    await sendPreSlotReminders();
    // Check logs
    const logs = require('../services/notificationService').NotificationService.prototype.getLogs.call(notificationService);
    expect(logs.some(l => l.notification.type === 'reminder')).toBe(true);
  });

  it('should enqueue missed session checks for incomplete sessions', async () => {
    const studentId = new mongoose.Types.ObjectId();
    await Session.create({
      slotId: new mongoose.Types.ObjectId(),
      date: '2025-09-05',
      plannedStartTs: new Date(Date.now() - 2 * 60 * 60 * 1000),
      plannedEndTs: new Date(Date.now() - 30 * 60 * 1000),
      orgId: new mongoose.Types.ObjectId(),
      studentId,
      status: 'started'
    });
    await sendMissedSessionChecks();
    const logs = require('../services/notificationService').NotificationService.prototype.getLogs.call(notificationService);
    expect(logs.some(l => l.notification.type === 'missed')).toBe(true);
  });

  it('should enqueue nightly digests for students', async () => {
    const studentId = new mongoose.Types.ObjectId();
    await Session.create({
      slotId: new mongoose.Types.ObjectId(),
      date: '2025-09-05',
      plannedStartTs: new Date(),
      plannedEndTs: new Date(Date.now() + 60 * 60 * 1000),
      orgId: new mongoose.Types.ObjectId(),
      studentId,
      status: 'completed'
    });
    await sendNightlyDigests();
    const logs = require('../services/notificationService').NotificationService.prototype.getLogs.call(notificationService);
    expect(logs.some(l => l.notification.type === 'digest')).toBe(true);
  });
});
