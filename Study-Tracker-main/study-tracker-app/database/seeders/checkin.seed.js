// Sample checkin seed script for Phase DB-09

const mongoose = require('mongoose');
const Checkin = require('../models/checkin');
const Session = require('../models/session');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const session = await Session.findOne({});
  const student = await User.findOne({ roles: 'student' });
  if (!session || !student) throw new Error('Seed session/user first');
  await Checkin.deleteMany({});
  await Checkin.create({
    sessionId: session._id,
    studentId: student._id,
    type: 'start',
    serverTs: new Date(),
    deviceMeta: { device: 'Android' },
    proofUrls: ['https://example.com/proof1.jpg'],
    note: 'Started session.'
  });
  console.log('Checkin seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
