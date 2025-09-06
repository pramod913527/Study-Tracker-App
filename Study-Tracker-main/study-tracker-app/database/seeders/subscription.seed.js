// Sample subscription seed script for Phase DB-18

const mongoose = require('mongoose');
const Subscription = require('../models/subscription');
const Org = require('../models/org');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const org = await Org.findOne({});
  if (!org) throw new Error('Seed orgs first');
  await Subscription.deleteMany({});
  await Subscription.create({
    planId: 'basic',
    orgId: org._id,
    startAt: new Date(),
    status: 'active'
  });
  console.log('Subscription seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
