// Validation and CRUD tests for Subscription model (Phase DB-18)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Subscription = require('../models/subscription');
const Org = require('../models/org');

describe('Subscription Model', () => {
  let org;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    org = await Org.create({ name: 'SubOrg' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a subscription entry', async () => {
    const sub = await Subscription.create({
      planId: 'basic',
      orgId: org._id,
      startAt: new Date(),
      status: 'active'
    });
    expect(sub._id).toBeDefined();
    expect(sub.planId).toBe('basic');
  });
});
