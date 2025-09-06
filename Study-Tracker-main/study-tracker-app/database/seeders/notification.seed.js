// Sample notification seed script for Phase DB-10

const mongoose = require('mongoose');
const Notification = require('../models/notification');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const recipient = await User.findOne({ roles: 'parent' });
  if (!recipient) throw new Error('Seed parent user first');
  await Notification.deleteMany({});
  await Notification.create({
    recipientId: recipient._id,
    channel: 'whatsapp',
    templateId: 'session_start',
    payload: { student: 'Test Student', subject: 'Mathematics' },
    status: 'sent',
    sentAt: new Date(),
    deliveredAt: new Date(),
    failureReason: ''
  });
  console.log('Notification seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
