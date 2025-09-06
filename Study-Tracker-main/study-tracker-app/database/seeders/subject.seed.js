// Sample subject seed script for Phase DB-05

const mongoose = require('mongoose');
const Subject = require('../models/subject');
const Org = require('../models/org');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const org = await Org.findOne({});
  if (!org) throw new Error('Seed orgs first');
  await Subject.deleteMany({});
  await Subject.insertMany([
    { name: 'Mathematics', code: 'MATH', color: '#ff0000', orgId: org._id },
    { name: 'Science', code: 'SCI', color: '#00ff00', orgId: org._id }
  ]);
  console.log('Subject seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
