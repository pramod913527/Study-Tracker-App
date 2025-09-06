// Sample user seed script for Phase DB-01

const mongoose = require('mongoose');
const User = require('../models/user');

const users = [
  {
    name: 'Test Student',
    phone: '+919999999999',
    email: 'student1@example.com',
    tz: 'Asia/Kolkata',
    roles: ['student'],
    status: 'active',
    meta: { grade: '10', school: 'ABC School' }
  },
  {
    name: 'Test Admin',
    phone: '+919888888888',
    email: 'admin1@example.com',
    tz: 'Asia/Kolkata',
    roles: ['admin'],
    status: 'active',
    meta: { department: 'IT' }
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteMany({});
  await User.insertMany(users);
  console.log('User seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
