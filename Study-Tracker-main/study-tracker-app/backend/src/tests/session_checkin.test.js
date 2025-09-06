const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');
const { addMinutes } = require('date-fns');

let app, models;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
  const Session = mongoose.model('Session', require('../../../database/models/session').schema);
  models = { Session };
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Session Checkin Endpoints', () => {
  let sessionId, plannedStartTs;
  beforeEach(async () => {
    await models.Session.deleteMany({});
    plannedStartTs = addMinutes(new Date(), 1); // 1 min in future
    sessionId = (await models.Session.create({
      slotId: new mongoose.Types.ObjectId(),
      date: '2025-09-05',
      plannedStartTs,
      plannedEndTs: addMinutes(plannedStartTs, 60),
      orgId: new mongoose.Types.ObjectId(),
      studentId: new mongoose.Types.ObjectId(),
      status: 'planned'
    }))._id;
  });

  it('should allow start within window and enforce idempotency', async () => {
    // Start within window
    const res1 = await request(app).post(`/sessions/${sessionId}/start`).send();
    expect(res1.statusCode).toBe(200);
    expect(res1.body.status).toBe('started');
    // Idempotent
    const res2 = await request(app).post(`/sessions/${sessionId}/start`).send();
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('started');
  });

  it('should reject start outside window', async () => {
    // Move plannedStartTs far in past
    await models.Session.findByIdAndUpdate(sessionId, { plannedStartTs: addMinutes(new Date(), -30) });
    const res = await request(app).post(`/sessions/${sessionId}/start`).send();
    expect(res.statusCode).toBe(400);
  });

  it('should enforce status transitions', async () => {
    // Start
    await request(app).post(`/sessions/${sessionId}/start`).send();
    // Mid-code
    const res1 = await request(app).post(`/sessions/${sessionId}/mid-code`).send();
    expect(res1.statusCode).toBe(200);
    expect(res1.body.status).toBe('mid-checked');
    // Complete
    const res2 = await request(app).post(`/sessions/${sessionId}/complete`).send();
    expect(res2.statusCode).toBe(200);
    expect(res2.body.status).toBe('completed');
    // Idempotent complete
    const res3 = await request(app).post(`/sessions/${sessionId}/complete`).send();
    expect(res3.statusCode).toBe(200);
    expect(res3.body.status).toBe('completed');
  });
});
