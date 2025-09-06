// Sample proof seed script for Phase DB-14

const mongoose = require('mongoose');
const Proof = require('../models/proof');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const user = await User.findOne({});
  if (!user) throw new Error('Seed users first');
  await Proof.deleteMany({});
  await Proof.create({
    url: 'https://example.com/proof.jpg',
    hash: 'abc123',
    checksum: 'def456',
    uploadedBy: user._id,
    uploadedAt: new Date(),
    mime: 'image/jpeg',
    expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  console.log('Proof seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
