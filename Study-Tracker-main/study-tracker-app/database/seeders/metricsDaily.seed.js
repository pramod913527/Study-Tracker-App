// Sample metricsDaily seed script for Phase DB-12

const mongoose = require('mongoose');
const MetricsDaily = require('../models/metricsDaily');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const student = await User.findOne({ roles: 'student' });
  if (!student) throw new Error('Seed student user first');
  await MetricsDaily.deleteMany({});
  await MetricsDaily.create({
    studentId: student._id,
    date: '2025-09-05',
    assigned: 5,
    completed: 4,
    onTime: 3,
    avgDelay: 10,
    streak: 2
  });
  console.log('MetricsDaily seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
