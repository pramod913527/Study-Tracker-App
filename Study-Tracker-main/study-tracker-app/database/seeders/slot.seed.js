// Sample slot seed script for Phase DB-07

const mongoose = require('mongoose');
const Slot = require('../models/slot');
const Timetable = require('../models/timetable');
const Subject = require('../models/subject');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const timetable = await Timetable.findOne({});
  const subject = await Subject.findOne({});
  if (!timetable || !subject) throw new Error('Seed timetable/subjects first');
  await Slot.deleteMany({});
  await Slot.insertMany([
    {
      timetableId: timetable._id,
      subjectId: subject._id,
      startTime: '09:00',
      endTime: '10:00',
      recurrence: ['Mon', 'Wed', 'Fri'],
      proofPolicy: 'selfie',
      preBufferMin: 5,
      graceMin: 10
    },
    {
      timetableId: timetable._id,
      subjectId: subject._id,
      startTime: '11:00',
      endTime: '12:00',
      recurrence: ['Tue', 'Thu'],
      proofPolicy: 'quiz',
      preBufferMin: 0,
      graceMin: 5
    }
  ]);
  console.log('Slot seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
