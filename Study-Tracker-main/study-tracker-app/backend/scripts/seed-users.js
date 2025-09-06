// Seed users for each role with default password
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../.env.dev' });

const userSchema = require('../../database/models/user').schema;
const User = mongoose.model('User', userSchema);
const userRoleSchema = require('../../database/models/userRole').schema;
const UserRole = mongoose.model('UserRole', userRoleSchema);
const roleSchema = require('../../database/models/role').schema;
const Role = mongoose.model('Role', roleSchema);

const users = [
  { name: 'Dev User', email: 'dev@example.com', phone: '+911111111111', role: 'developer' },
  { name: 'Admin User', email: 'admin@example.com', phone: '+912222222222', role: 'admin' },
  { name: 'Mentor User', email: 'mentor@example.com', phone: '+913333333333', role: 'mentor' },
  { name: 'Parent User', email: 'parent@example.com', phone: '+914444444444', role: 'parent' },
  { name: 'Student User', email: 'student@example.com', phone: '+915555555555', role: 'student' },
];

const DEFAULT_PASSWORD = 'Test@123';

async function seedUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const user of users) {
    // Check if user exists
    let dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      dbUser = await User.create({ name: user.name, email: user.email, phone: user.phone, password: hashed });
      console.log('Created user:', user.email);
    } else {
      console.log('User exists:', user.email);
    }
    // Assign role if not already assigned
    const roleDef = await Role.findOne({ name: user.role });
    if (!roleDef) {
      console.log('Role not found for', user.role);
      continue;
    }
    const hasRole = await UserRole.findOne({ userId: dbUser._id, role: user.role });
    if (!hasRole) {
      await UserRole.create({ userId: dbUser._id, role: user.role, grantedBy: dbUser._id });
      console.log('Assigned role', user.role, 'to', user.email);
    } else {
      console.log('Role already assigned for', user.email);
    }
  }
  await mongoose.disconnect();
  console.log('Done seeding users and roles.');
}

seedUsers();
