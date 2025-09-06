// Validation and CRUD tests for Invitation model (Phase DB-04)

const mongoose = require('mongoose');
const Invitation = require('../models/invitation');
const User = require('../models/user');
const Org = require('../models/org');
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
jest.setTimeout(20000);

describe('Invitation Model', () => {
  let inviter, org;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    inviter = await User.create({ name: 'Inviter', phone: '+911234567892', email: 'inviter@example.com' });
    org = await Org.create({ name: 'InviteOrg' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create an invitation', async () => {
    const inv = await Invitation.create({
      token: uuidv4(),
      inviterId: inviter._id,
      inviteeContact: '+919888888888',
      role: 'parent',
      orgId: org._id,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    expect(inv._id).toBeDefined();
    expect(inv.status).toBe('pending');
  });

  it('should not allow duplicate tokens', async () => {
    const token = uuidv4();
    await Invitation.create({ token, inviterId: inviter._id, inviteeContact: '+919999999999', role: 'parent', orgId: org._id, status: 'pending', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await expect(Invitation.create({ token, inviterId: inviter._id, inviteeContact: '+919999999998', role: 'parent', orgId: org._id, status: 'pending', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })).rejects.toThrow();
  });
});
