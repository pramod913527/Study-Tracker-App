// Sample consent seed script for Phase DB-17

const mongoose = require('mongoose');
const Consent = require('../models/consent');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const user = await User.findOne({});
  if (!user) throw new Error('Seed users first');
  await Consent.deleteMany({});
  await Consent.create({
    userId: user._id,
    purpose: 'notifications',
    givenAt: new Date(),
    revokedAt: null
  });
  console.log('Consent seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
