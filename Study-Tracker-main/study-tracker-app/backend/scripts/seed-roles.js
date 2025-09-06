
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env.dev' });

const roles = [
  { name: 'developer', permissions: ['*'] },
  { name: 'admin', permissions: ['manage:all'] },
  { name: 'mentor', permissions: ['manage:students', 'view:reports'] },
  { name: 'parent', permissions: ['view:child', 'view:reports'] },
  { name: 'student', permissions: ['view:self', 'mark:tasks'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  // Register Role model on the connected mongoose instance
  const roleSchema = require('../../database/models/role').schema;
  const Role = mongoose.model('Role', roleSchema);
  for (const role of roles) {
    await Role.updateOne({ name: role.name }, { $set: role }, { upsert: true });
    console.log('Seeded role:', role.name);
  }
  await mongoose.disconnect();
  console.log('Done.');
}
seed();
