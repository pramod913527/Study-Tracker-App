// Validation and CRUD tests for AuditLog model (Phase DB-11)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const AuditLog = require('../models/auditLog');
const User = require('../models/user');

describe('AuditLog Model', () => {
  let actor;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    actor = await User.create({ name: 'AuditActor', phone: '+911234567897', email: 'auditactor@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create an audit log entry', async () => {
    const log = await AuditLog.create({
      actorId: actor._id,
      actionType: 'test_action',
      resourceType: 'user',
      resourceId: actor._id,
      before: {},
      after: { role: 'admin' },
      ts: new Date()
    });
    expect(log._id).toBeDefined();
    expect(log.actionType).toBe('test_action');
  });
});
