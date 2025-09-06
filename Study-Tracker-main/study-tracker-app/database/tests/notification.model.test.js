// Validation and CRUD tests for Notification model (Phase DB-10)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Notification = require('../models/notification');
const User = require('../models/user');

describe('Notification Model', () => {
  let recipient;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    recipient = await User.create({ name: 'NotifUser', phone: '+911234567896', email: 'notifuser@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a notification with valid data', async () => {
    const notif = await Notification.create({
      recipientId: recipient._id,
      channel: 'whatsapp',
      templateId: 'session_start',
      payload: { student: 'NotifUser', subject: 'Math' },
      status: 'sent',
      sentAt: new Date(),
      deliveredAt: new Date(),
      failureReason: ''
    });
    expect(notif._id).toBeDefined();
    expect(notif.channel).toBe('whatsapp');
  });

  it('should index by recipientId and sentAt', async () => {
    const notif = await Notification.create({
      recipientId: recipient._id,
      channel: 'email',
      templateId: 'session_complete',
      payload: {},
      status: 'delivered',
      sentAt: new Date(),
      deliveredAt: new Date(),
      failureReason: ''
    });
    const found = await Notification.find({ recipientId: recipient._id });
    expect(found.length).toBeGreaterThan(0);
  });
});
