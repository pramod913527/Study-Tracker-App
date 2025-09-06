// Validation and CRUD tests for Subject model (Phase DB-05)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Subject = require('../models/subject');
const Org = require('../models/org');

describe('Subject Model', () => {
  let org;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    org = await Org.create({ name: 'SubjectOrg' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a subject with valid data', async () => {
    const subject = await Subject.create({
      name: 'English',
      code: 'ENG',
      color: '#0000ff',
      orgId: org._id
    });
    expect(subject._id).toBeDefined();
    expect(subject.name).toBe('English');
  });

  it('should not allow duplicate subject name in same org', async () => {
    await Subject.create({ name: 'Math', code: 'MATH', orgId: org._id });
    await expect(Subject.create({ name: 'Math', code: 'MATH2', orgId: org._id })).rejects.toThrow();
  });

  it('should allow same subject name in different orgs', async () => {
    const org2 = await Org.create({ name: 'OtherOrg' });
    const subject = await Subject.create({ name: 'Math', code: 'MATH3', orgId: org2._id });
    expect(subject._id).toBeDefined();
  });
});
