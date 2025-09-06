// Validation and CRUD tests for MetricsDaily model (Phase DB-12)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const MetricsDaily = require('../models/metricsDaily');
const User = require('../models/user');

describe('MetricsDaily Model', () => {
  let student;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    student = await User.create({ name: 'MetricsStudent', phone: '+911234567898', email: 'metricsstudent@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a metricsDaily entry', async () => {
    const metrics = await MetricsDaily.create({
      studentId: student._id,
      date: '2025-09-05',
      assigned: 3,
      completed: 2,
      onTime: 2,
      avgDelay: 5,
      streak: 1
    });
    expect(metrics._id).toBeDefined();
    expect(metrics.date).toBe('2025-09-05');
  });

  it('should not allow duplicate studentId and date', async () => {
    await MetricsDaily.create({ studentId: student._id, date: '2025-09-06' });
    let error = null;
    try {
      await MetricsDaily.create({ studentId: student._id, date: '2025-09-06' });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.code).toBe(11000);
  });
});
