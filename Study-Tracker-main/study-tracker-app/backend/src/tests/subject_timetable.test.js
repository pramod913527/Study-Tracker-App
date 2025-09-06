const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');

let app, models;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
  const Subject = mongoose.model('Subject', require('../../../database/models/subject').schema);
  const Timetable = mongoose.model('Timetable', require('../../../database/models/timetable').schema);
  models = { Subject, Timetable };
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Subjects & Timetables API', () => {
  beforeEach(async () => {
    await models.Subject.deleteMany({});
    await models.Timetable.deleteMany({});
  });

  it('should create and fetch subjects (org scoped)', async () => {
    const orgId = new mongoose.Types.ObjectId();
    const res1 = await request(app)
      .post('/subjects')
      .set('x-org-id', orgId.toString())
      .send({ name: 'Math', code: 'MATH101' });
    expect(res1.statusCode).toBe(201);
    expect(res1.body.name).toBe('Math');
    const res2 = await request(app)
      .get('/subjects')
      .set('x-org-id', orgId.toString());
    expect(res2.statusCode).toBe(200);
    expect(res2.body.length).toBe(1);
    expect(res2.body[0].name).toBe('Math');
  });

  it('should create, fetch, and update timetables (ownership enforced)', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    // Create timetable
    const res1 = await request(app)
      .post('/timetables')
      .set('x-user-id', ownerId.toString())
      .send({ title: 'My Timetable' });
    expect(res1.statusCode).toBe(201);
    expect(res1.body.title).toBe('My Timetable');
    // Fetch timetables
    const res2 = await request(app)
      .get('/timetables')
      .set('x-user-id', ownerId.toString());
    expect(res2.statusCode).toBe(200);
    expect(res2.body.length).toBe(1);
    // Update timetable (ownership enforced)
    const res3 = await request(app)
      .put(`/timetables/${res1.body._id}`)
      .set('x-user-id', ownerId.toString())
      .send({ title: 'Updated Timetable' });
    expect(res3.statusCode).toBe(200);
    expect(res3.body.title).toBe('Updated Timetable');
    // Try update as another user (should fail)
    const res4 = await request(app)
      .put(`/timetables/${res1.body._id}`)
      .set('x-user-id', new mongoose.Types.ObjectId().toString())
      .send({ title: 'Hacker Update' });
    expect(res4.statusCode).toBe(404);
  });

  it('should support timetable templates', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    // Create a template timetable
    const template = await models.Timetable.create({ ownerId, title: 'Template', visibility: 'org' });
    // Create a new timetable using templateId
    const res = await request(app)
      .post('/timetables')
      .set('x-user-id', ownerId.toString())
      .send({ title: 'From Template', templateId: template._id });
    expect(res.statusCode).toBe(201);
    expect(res.body.templateId).toBe(template._id.toString());
  });
});
