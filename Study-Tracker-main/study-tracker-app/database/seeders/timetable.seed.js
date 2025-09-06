// Sample timetable seed script for Phase DB-06

const mongoose = require('mongoose');
const Timetable = require('../models/timetable');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const user = await User.findOne({ roles: 'student' });
  if (!user) throw new Error('Seed users first');
  await Timetable.deleteMany({});
  await Timetable.create({
    ownerId: user._id,
    title: 'Default Timetable',
    visibility: 'private',
    tz: 'Asia/Kolkata',
    settings: { weekStart: 'Monday' }
  });
  console.log('Timetable seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
