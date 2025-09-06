// Sample session seed script for Phase DB-08

const mongoose = require('mongoose');
const Session = require('../models/session');
const Slot = require('../models/slot');
const Org = require('../models/org');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const slot = await Slot.findOne({});
  const org = await Org.findOne({});
  const student = await User.findOne({ roles: 'student' });
  if (!slot || !org || !student) throw new Error('Seed slot/org/user first');
  await Session.deleteMany({});
  await Session.create({
    slotId: slot._id,
    date: '2025-09-05',
    plannedStartTs: new Date('2025-09-05T09:00:00+05:30'),
    plannedEndTs: new Date('2025-09-05T10:00:00+05:30'),
    status: 'planned',
    orgId: org._id,
    studentId: student._id
  });
  console.log('Session seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
