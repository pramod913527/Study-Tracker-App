// Validation and CRUD tests for BillingPlan model (Phase DB-18)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const BillingPlan = require('../models/billingPlan');
const Org = require('../models/org');

describe('BillingPlan Model', () => {
  let org;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    org = await Org.create({ name: 'BillingOrg' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a billing plan entry', async () => {
    const plan = await BillingPlan.create({
      planId: 'premium',
      orgId: org._id,
      startAt: new Date(),
      status: 'active'
    });
    expect(plan._id).toBeDefined();
    expect(plan.planId).toBe('premium');
  });

  it('should not allow duplicate planId', async () => {
    await BillingPlan.create({ planId: 'unique', orgId: org._id, startAt: new Date() });
    await expect(BillingPlan.create({ planId: 'unique', orgId: org._id, startAt: new Date() })).rejects.toThrow();
  });
});
