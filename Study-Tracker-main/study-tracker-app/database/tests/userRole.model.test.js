// Validation and CRUD tests for UserRole model (Phase DB-03)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const UserRole = require('../models/userRole');
const User = require('../models/user');
const Org = require('../models/org');

describe('UserRole Model', () => {
  let user, org;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    user = await User.create({ name: 'RoleUser', phone: '+911234567891', email: 'roleuser@example.com' });
    org = await Org.create({ name: 'RoleOrg' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a user role grant', async () => {
    const ur = await UserRole.create({
      userId: user._id,
      role: 'admin',
      orgId: org._id,
      grantedBy: user._id
    });
    expect(ur._id).toBeDefined();
    expect(ur.role).toBe('admin');
  });

  it('should not allow duplicate user-role-org', async () => {
    await UserRole.create({ userId: user._id, role: 'mentor', orgId: org._id, grantedBy: user._id });
    await expect(UserRole.create({ userId: user._id, role: 'mentor', orgId: org._id, grantedBy: user._id })).rejects.toThrow();
  });
});
