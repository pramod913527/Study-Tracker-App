// Sample settings seed script for Phase DB-13

const mongoose = require('mongoose');
const Settings = require('../models/settings');
const Org = require('../models/org');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const org = await Org.findOne({});
  if (!org) throw new Error('Seed orgs first');
  await Settings.deleteMany({});
  await Settings.create({
    orgId: org._id,
    proofPolicyDefault: 'selfie',
    lockWindows: { start: '08:00', end: '20:00' },
    mediaRetentionDays: 30,
    notificationTemplates: { session_start: 'Session started', session_complete: 'Session complete' }
  });
  console.log('Settings seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
