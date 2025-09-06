// Sample escalation seed script for Phase DB-15

const mongoose = require('mongoose');
const Escalation = require('../models/escalation');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Escalation.deleteMany({});
  await Escalation.create({
    trigger: 'missed_sessions',
    conditions: { count: 2 },
    actions: { notify: 'admin' }
  });
  console.log('Escalation seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
