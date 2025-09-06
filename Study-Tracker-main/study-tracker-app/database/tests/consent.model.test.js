// Validation and CRUD tests for Consent model (Phase DB-17)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Consent = require('../models/consent');
const User = require('../models/user');

describe('Consent Model', () => {
  let user;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    user = await User.create({ name: 'ConsentUser', phone: '+911234567901', email: 'consentuser@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a consent entry', async () => {
    const consent = await Consent.create({
      userId: user._id,
      purpose: 'notifications',
      givenAt: new Date(),
      revokedAt: null
    });
    expect(consent._id).toBeDefined();
    expect(consent.purpose).toBe('notifications');
  });
});
