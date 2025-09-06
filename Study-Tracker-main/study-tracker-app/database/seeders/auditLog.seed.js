// Sample audit log seed script for Phase DB-11

const mongoose = require('mongoose');
const AuditLog = require('../models/auditLog');
const User = require('../models/user');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const actor = await User.findOne({});
  if (!actor) throw new Error('Seed users first');
  await AuditLog.deleteMany({});
  await AuditLog.create({
    actorId: actor._id,
    actionType: 'role_grant',
    resourceType: 'userRole',
    resourceId: actor._id,
    before: {},
    after: { role: 'admin' },
    ts: new Date()
  });
  console.log('AuditLog seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
