// Validation and CRUD tests for Org model (Phase DB-02)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Org = require('../models/org');

describe('Org Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create an org with valid data', async () => {
    const org = await Org.create({
      name: 'Test Org',
      timezone: 'Asia/Kolkata',
      branding: { logo: 'logo.png' },
      settings: { allowInvites: true }
    });
    expect(org._id).toBeDefined();
    expect(org.timezone).toBe('Asia/Kolkata');
    expect(org.branding.logo).toBe('logo.png');
  });

  it('should not allow duplicate org names', async () => {
    await Org.create({ name: 'UniqueOrg' });
    await expect(Org.create({ name: 'UniqueOrg' })).rejects.toThrow();
  });

  it('should fetch org by id', async () => {
    const org = await Org.create({ name: 'FetchOrg' });
    const found = await Org.findById(org._id);
    expect(found.name).toBe('FetchOrg');
  });
});
