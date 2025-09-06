// Sample device seed script for Phase DB-16

const mongoose = require('mongoose');
const Device = require('../models/device');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const user = await User.findOne({});
  if (!user) throw new Error('Seed users first');
  await Device.deleteMany({});
  await Device.create({
    deviceId: 'device-001',
    userId: user._id,
    platform: 'Android',
    lastSeen: new Date(),
    deviceTrustFlag: true
  });
  console.log('Device seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
