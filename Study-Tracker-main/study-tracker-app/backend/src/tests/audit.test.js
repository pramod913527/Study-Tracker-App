const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('../index');

describe('Admin & Audit APIs', () => {
  let app, AuditLog, UserRole;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
    AuditLog = mongoose.model('AuditLog', require('../../../database/models/auditLog').schema);
    UserRole = mongoose.model('UserRole', require('../../../database/models/userRole').schema);
    app = createApp({ mongooseConnection: mongoose.connection, models: { AuditLog, UserRole } });
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    await AuditLog.deleteMany({});
    await UserRole.deleteMany({});
  });

  it('should create audit entry on role grant', async () => {
    const userId = new mongoose.Types.ObjectId();
    const orgId = new mongoose.Types.ObjectId();
    const grantedBy = new mongoose.Types.ObjectId();
    const res = await request(app).post('/roles/grant').send({ userId, role: 'admin', orgId, grantedBy });
    expect(res.statusCode).toBe(200);
    const audit = await AuditLog.findOne({ actionType: 'grant_role', resourceId: userId });
    expect(audit).toBeTruthy();
    expect(audit.actionType).toBe('grant_role');
    expect(audit.resourceType).toBe('UserRole');
    expect(audit.after.role).toBe('admin');
  });

  it('should return audit logs', async () => {
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(),
      actionType: 'test',
      resourceType: 'User',
      resourceId: new mongoose.Types.ObjectId(),
      before: {},
      after: {},
      ts: new Date()
    });
    const res = await request(app).get('/audit');
    expect(res.statusCode).toBe(200);
    expect(res.body.logs.length).toBeGreaterThan(0);
  });

  it('should return webhook logs', async () => {
    await AuditLog.create({
      actorId: new mongoose.Types.ObjectId(),
      actionType: 'webhook',
      resourceType: 'Webhook',
      resourceId: new mongoose.Types.ObjectId(),
      before: {},
      after: {},
      ts: new Date()
    });
    const res = await request(app).get('/webhook/logs');
    expect(res.statusCode).toBe(200);
    expect(res.body.logs.length).toBeGreaterThan(0);
  });
});
