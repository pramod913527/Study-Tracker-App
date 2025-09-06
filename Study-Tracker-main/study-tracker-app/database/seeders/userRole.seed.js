// Sample userRole seed script for Phase DB-03

const mongoose = require('mongoose');
const UserRole = require('../models/userRole');
const User = require('../models/user');
const Org = require('../models/org');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const user = await User.findOne({ roles: 'admin' });
  const org = await Org.findOne({});
  if (!user || !org) throw new Error('Seed users/orgs first');
  await UserRole.deleteMany({});
  await UserRole.create({
    userId: user._id,
    role: 'admin',
    orgId: org._id,
    grantedBy: user._id
  });
  console.log('UserRole seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
