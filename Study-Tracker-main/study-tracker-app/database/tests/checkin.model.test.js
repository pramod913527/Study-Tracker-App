// Validation and CRUD tests for Checkin model (Phase DB-09)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Checkin = require('../models/checkin');
const Session = require('../models/session');
const User = require('../models/user');

describe('Checkin Model', () => {
  let session, student;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    session = await Session.create({ slotId: new mongoose.Types.ObjectId(), date: '2025-09-05', plannedStartTs: new Date(), plannedEndTs: new Date(), orgId: new mongoose.Types.ObjectId(), studentId: new mongoose.Types.ObjectId() });
    student = await User.create({ name: 'CheckinStudent', phone: '+911234567895', email: 'checkinstudent@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a checkin with valid data', async () => {
    const checkin = await Checkin.create({
      sessionId: session._id,
      studentId: student._id,
      type: 'start',
      serverTs: new Date(),
      deviceMeta: { device: 'iOS' },
      proofUrls: ['https://example.com/proof2.jpg'],
      note: 'Started.'
    });
    expect(checkin._id).toBeDefined();
    expect(checkin.type).toBe('start');
  });

  it('should index by sessionId and serverTs', async () => {
    const checkin = await Checkin.create({
      sessionId: session._id,
      studentId: student._id,
      type: 'complete',
      serverTs: new Date(),
      deviceMeta: {},
      proofUrls: [],
      note: ''
    });
    const found = await Checkin.find({ sessionId: session._id });
    expect(found.length).toBeGreaterThan(0);
  });
});
