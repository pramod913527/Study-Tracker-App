// Validation and CRUD tests for Escalation model (Phase DB-15)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Escalation = require('../models/escalation');

describe('Escalation Model', () => {
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

  it('should create an escalation entry', async () => {
    const esc = await Escalation.create({
      trigger: 'missed_sessions',
      conditions: { count: 2 },
      actions: { notify: 'admin' }
    });
    expect(esc._id).toBeDefined();
    expect(esc.trigger).toBe('missed_sessions');
  });
});
