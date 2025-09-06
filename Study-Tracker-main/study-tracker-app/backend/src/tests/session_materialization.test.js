const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');
const materializeSessions = require('../jobs/materializeSessions');

let app, models;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
  const Subject = mongoose.model('Subject', require('../../../database/models/subject').schema);
  const Timetable = mongoose.model('Timetable', require('../../../database/models/timetable').schema);
  const Slot = mongoose.model('Slot', require('../../../database/models/slot').schema);
  const Session = mongoose.model('Session', require('../../../database/models/session').schema);
  models = { Subject, Timetable, Slot, Session };
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Session Materialization Job', () => {
  let orgId, studentId, timetableId, subjectId;
  beforeEach(async () => {
    await models.Subject.deleteMany({});
    await models.Timetable.deleteMany({});
    await models.Slot.deleteMany({});
    await models.Session.deleteMany({});
    orgId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();
    subjectId = (await models.Subject.create({ name: 'Math', code: 'MATH', orgId }))._id;
    timetableId = (await models.Timetable.create({ ownerId: studentId, title: 'TT' }))._id;
    // Mon/Wed slot
    await models.Slot.create({ timetableId, subjectId, startTime: '09:00', endTime: '10:00', recurrence: ['Mon', 'Wed'] });
  });

  it('should materialize sessions for next 7 days', async () => {
    const today = new Date();
    const sessions = await materializeSessions({ models, timetableId, startDate: today, days: 7, orgId, studentId });
    expect(sessions.length).toBeGreaterThan(0);
    // Should only create sessions for Mon/Wed
    const weekdays = sessions.map(s => new Date(s.plannedStartTs).toLocaleDateString('en-US', { weekday: 'short' }));
    expect(weekdays.every(d => d === 'Mon' || d === 'Wed')).toBe(true);
  // Sessions are in DB (find by slotIds for this timetable)
  const slots = await models.Slot.find({ timetableId });
  const slotIds = slots.map(s => s._id);
  const dbSessions = await models.Session.find({ slotId: { $in: slotIds } });
  expect(dbSessions.length).toBe(sessions.length);
  });
});
