// Validation and CRUD tests for Settings model (Phase DB-13)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Settings = require('../models/settings');
const Org = require('../models/org');

describe('Settings Model', () => {
  let org;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    org = await Org.create({ name: 'SettingsOrg' });
  });

  beforeEach(async () => {
    await Settings.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a settings entry for an org', async () => {
    const settings = await Settings.create({
      orgId: org._id,
      proofPolicyDefault: 'quiz',
      lockWindows: { start: '09:00', end: '18:00' },
      mediaRetentionDays: 15,
      notificationTemplates: { session_start: 'Start', session_complete: 'Complete' }
    });
    expect(settings._id).toBeDefined();
    expect(settings.orgId.toString()).toBe(org._id.toString());
  });

  it('should not allow duplicate settings for same org', async () => {
    await Settings.create({ orgId: org._id });
    let error = null;
    try {
      await Settings.create({ orgId: org._id });
    } catch (err) {
      error = err;
    }
    expect(error).toBeTruthy();
    expect(error.code).toBe(11000);
  });
});
