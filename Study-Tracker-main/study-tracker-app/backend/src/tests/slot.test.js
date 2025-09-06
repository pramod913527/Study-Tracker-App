const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');

let app, models;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
  const Subject = mongoose.model('Subject', require('../../../database/models/subject').schema);
  const Timetable = mongoose.model('Timetable', require('../../../database/models/timetable').schema);
  const Slot = mongoose.model('Slot', require('../../../database/models/slot').schema);
  models = { Subject, Timetable, Slot };
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Slots Management & Recurrence', () => {
  let orgId, subjectId, timetableId;
  beforeEach(async () => {
    await models.Subject.deleteMany({});
    await models.Timetable.deleteMany({});
    await models.Slot.deleteMany({});
    orgId = new mongoose.Types.ObjectId();
    subjectId = (await models.Subject.create({ name: 'Math', code: 'MATH', orgId }))._id;
    timetableId = (await models.Timetable.create({ ownerId: new mongoose.Types.ObjectId(), title: 'TT' }))._id;
  });

  it('should create a slot and reject overlaps', async () => {
    // Create slot Mon 09:00-10:00
    const res1 = await request(app)
      .post(`/timetables/${timetableId}/slots`)
      .send({ subjectId, startTime: '09:00', endTime: '10:00', recurrence: ['Mon'] });
    expect(res1.statusCode).toBe(201);
    // Overlapping slot on Mon should fail
    const res2 = await request(app)
      .post(`/timetables/${timetableId}/slots`)
      .send({ subjectId, startTime: '09:30', endTime: '10:30', recurrence: ['Mon'] });
    expect(res2.statusCode).toBe(400);
    // Non-overlapping slot on Tue should succeed
    const res3 = await request(app)
      .post(`/timetables/${timetableId}/slots`)
      .send({ subjectId, startTime: '09:30', endTime: '10:30', recurrence: ['Tue'] });
    expect(res3.statusCode).toBe(201);
  });

  it('should update and delete slots', async () => {
    const res1 = await request(app)
      .post(`/timetables/${timetableId}/slots`)
      .send({ subjectId, startTime: '11:00', endTime: '12:00', recurrence: ['Wed'] });
    const slotId = res1.body._id;
    // Update
    const res2 = await request(app)
      .put(`/slots/${slotId}`)
      .send({ startTime: '11:30', endTime: '12:30' });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.startTime).toBe('11:30');
    // Delete
    const res3 = await request(app)
      .delete(`/slots/${slotId}`);
    expect(res3.statusCode).toBe(200);
    expect(res3.body.success).toBe(true);
  });
});
