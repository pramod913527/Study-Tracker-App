

process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/studytracker_test';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.test') });

const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');

let app, models;

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {});
  // Register models on the test mongoose connection
  const User = mongoose.model('User', require('../../../database/models/user').schema);
  const UserRole = mongoose.model('UserRole', require('../../../database/models/userRole').schema);
  const Org = mongoose.model('Org', require('../../../database/models/org').schema);
  const Invitation = mongoose.model('Invitation', require('../../../database/models/invitation').schema);
  const Settings = mongoose.model('Settings', require('../../../database/models/settings').schema);
  const Subject = mongoose.model('Subject', require('../../../database/models/subject').schema);
  const Timetable = mongoose.model('Timetable', require('../../../database/models/timetable').schema);
  const Slot = mongoose.model('Slot', require('../../../database/models/slot').schema);
  const Session = mongoose.model('Session', require('../../../database/models/session').schema);
  const Proof = mongoose.model('Proof', require('../../../database/models/proof').schema);
  models = { User, UserRole, Org, Invitation, Settings, Subject, Timetable, Slot, Session, Proof };
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Users & Roles API', () => {
  beforeEach(async () => {
    await models.User.deleteMany({});
    await models.UserRole.deleteMany({});
  });

  it('should create and fetch users', async () => {
    const res1 = await request(app).post('/users').send({ name: 'Test User', phone: '+911234567890', email: 'test@example.com' });
    expect(res1.statusCode).toBe(201);
    const res2 = await request(app).get('/users');
    expect(res2.body.length).toBeGreaterThan(0);
  });

  it('should grant and revoke user role as developer', async () => {
    // Create a user who will be granted the role
    const user = await models.User.create({ name: 'RoleUser', phone: '+911234567891', email: 'role@example.com' });
    // Create a user who will be the grantor
    const grantor = await models.User.create({ name: 'Grantor', phone: '+911234567892', email: 'grantor@example.com' });
    const org = await models.Org.create({ name: 'RoleOrg' });
    const grant = await request(app)
      .post('/user-roles/grant')
      .set('x-user-role', 'developer')
      .send({ userId: user._id, orgId: org._id, role: 'admin', grantedBy: grantor._id });
    expect(grant.statusCode).toBe(201);
    const revoke = await request(app)
      .post('/user-roles/revoke')
      .set('x-user-role', 'developer')
      .send({ userId: user._id, orgId: org._id, role: 'admin' });
    expect(revoke.body.success).toBe(true);
  });

  it('should forbid grant/revoke for non-admin/developer', async () => {
    const user = await models.User.create({ name: 'RoleUser2', phone: '+911234567895', email: 'role2@example.com' });
    const grantor = await models.User.create({ name: 'Grantor2', phone: '+911234567896', email: 'grantor2@example.com' });
    const org = await models.Org.create({ name: 'RoleOrg2' });
    const grant = await request(app)
      .post('/user-roles/grant')
      .set('x-user-role', 'student')
      .send({ userId: user._id, orgId: org._id, role: 'admin', grantedBy: grantor._id });
    expect(grant.statusCode).toBe(403);
    expect(grant.body.error).toMatch(/insufficient role/i);
    const revoke = await request(app)
      .post('/user-roles/revoke')
      .set('x-user-role', 'student')
      .send({ userId: user._id, orgId: org._id, role: 'admin' });
    expect(revoke.statusCode).toBe(403);
    expect(revoke.body.error).toMatch(/insufficient role/i);
  });
});

describe('Orgs & Settings API', () => {
  beforeEach(async () => {
    await models.Org.deleteMany({});
    await models.Settings.deleteMany({});
  });
  it('should create and fetch orgs', async () => {
    const res1 = await request(app).post('/orgs').send({ name: 'TestOrg' });
    expect(res1.statusCode).toBe(201);
    expect(res1.body.name).toBe('TestOrg');
    const res2 = await request(app).get('/orgs');
    expect(res2.statusCode).toBe(200);
    expect(Array.isArray(res2.body)).toBe(true);
    expect(res2.body.length).toBeGreaterThan(0);
  });
  it('should update org settings', async () => {
    const org = await models.Org.create({ name: 'SettingsOrg2' });
    const res = await request(app).put(`/orgs/${org._id}/settings`).send({ mediaRetentionDays: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.mediaRetentionDays).toBe(10);
    // Confirm settings are stored for the org
    const settings = await models.Settings.findOne({ orgId: org._id });
    expect(settings).toBeTruthy();
    expect(settings.mediaRetentionDays).toBe(10);
  });
});

describe('Invitations Flow', () => {
  beforeEach(async () => {
    await models.Invitation.deleteMany({});
  });
  it('should create, fetch, and accept invitation', async () => {
    const org = await models.Org.create({ name: 'InviteOrg' });
    const inviter = await models.User.create({ name: 'Inviter', phone: '+911234567893', email: 'inviter@example.com' });
    const inviteeContact = 'invitee@example.com';
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
    const res1 = await request(app).post('/invitations').send({ orgId: org._id, inviterId: inviter._id, inviteeContact, role: 'student', expiresAt });
    expect(res1.statusCode).toBe(201);
    const token = res1.body.token;
    const res2 = await request(app).get(`/invitations/${token}`);
    expect(res2.statusCode).toBe(200);
    const res3 = await request(app).post(`/invitations/${token}/accept`).send({ name: 'Invitee', phone: '+911234567894' });
    if (res3.statusCode !== 200) {
      // Print error for debugging
      console.error('Invitation accept error:', res3.body);
    }
    expect(res3.statusCode).toBe(200);
    expect(res3.body.user.email).toBe('invitee@example.com');
  });
});
