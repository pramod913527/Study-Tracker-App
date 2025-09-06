// Sample invitation seed script for Phase DB-04

const mongoose = require('mongoose');
const Invitation = require('../models/invitation');
const User = require('../models/user');
const Org = require('../models/org');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const inviter = await User.findOne({ roles: 'admin' });
  const org = await Org.findOne({});
  if (!inviter || !org) throw new Error('Seed users/orgs first');
  await Invitation.deleteMany({});
  await Invitation.create({
    token: uuidv4(),
    inviterId: inviter._id,
    inviteeContact: '+919777777777',
    role: 'parent',
    orgId: org._id,
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  console.log('Invitation seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
