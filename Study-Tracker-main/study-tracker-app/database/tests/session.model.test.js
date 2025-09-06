// Validation and CRUD tests for Session model (Phase DB-08)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Session = require('../models/session');
const Slot = require('../models/slot');
const Org = require('../models/org');
const User = require('../models/user');

describe('Session Model', () => {
  let slot, org, student;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    slot = await Slot.create({ timetableId: new mongoose.Types.ObjectId(), subjectId: new mongoose.Types.ObjectId(), startTime: '09:00', endTime: '10:00' });
    org = await Org.create({ name: 'SessionOrg' });
    student = await User.create({ name: 'SessionStudent', phone: '+911234567894', email: 'sessionstudent@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a session with valid data', async () => {
    const session = await Session.create({
      slotId: slot._id,
      date: '2025-09-05',
      plannedStartTs: new Date('2025-09-05T09:00:00+05:30'),
      plannedEndTs: new Date('2025-09-05T10:00:00+05:30'),
      status: 'planned',
      orgId: org._id,
      studentId: student._id
    });
    expect(session._id).toBeDefined();
    expect(session.status).toBe('planned');
  });

  it('should index by studentId and date', async () => {
    const session = await Session.create({
      slotId: slot._id,
      date: '2025-09-06',
      plannedStartTs: new Date('2025-09-06T09:00:00+05:30'),
      plannedEndTs: new Date('2025-09-06T10:00:00+05:30'),
      status: 'planned',
      orgId: org._id,
      studentId: student._id
    });
    const found = await Session.find({ studentId: student._id, date: '2025-09-06' });
    expect(found.length).toBeGreaterThan(0);
  });
});
