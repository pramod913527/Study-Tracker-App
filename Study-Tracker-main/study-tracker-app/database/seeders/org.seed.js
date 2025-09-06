// Sample org seed script for Phase DB-02

const mongoose = require('mongoose');
const Org = require('../models/org');

const orgs = [
  {
    name: 'Demo School',
    timezone: 'Asia/Kolkata',
    branding: { logo: 'https://example.com/logo.png', color: '#123456' },
    settings: { allowInvites: true }
  },
  {
    name: 'Test Coaching',
    timezone: 'Asia/Kolkata',
    branding: { logo: 'https://example.com/logo2.png', color: '#654321' },
    settings: { allowInvites: false }
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Org.deleteMany({});
  await Org.insertMany(orgs);
  console.log('Org seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
