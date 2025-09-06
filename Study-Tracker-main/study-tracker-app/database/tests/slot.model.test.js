// Validation and CRUD tests for Slot model (Phase DB-07)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Slot = require('../models/slot');
const Timetable = require('../models/timetable');
const Subject = require('../models/subject');

describe('Slot Model', () => {
  let timetable, subject;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    timetable = await Timetable.create({ ownerId: new mongoose.Types.ObjectId(), title: 'SlotTT' });
    subject = await Subject.create({ name: 'SlotSub', code: 'SLOT', orgId: new mongoose.Types.ObjectId() });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a slot with valid data', async () => {
    const slot = await Slot.create({
      timetableId: timetable._id,
      subjectId: subject._id,
      startTime: '08:00',
      endTime: '09:00',
      recurrence: ['Mon', 'Wed'],
      proofPolicy: 'selfie',
      preBufferMin: 5,
      graceMin: 10
    });
    expect(slot._id).toBeDefined();
    expect(slot.startTime).toBe('08:00');
  });

  it('should index by timetableId and startTime', async () => {
    const slot = await Slot.create({
      timetableId: timetable._id,
      subjectId: subject._id,
      startTime: '10:00',
      endTime: '11:00',
      recurrence: ['Tue'],
      proofPolicy: '',
      preBufferMin: 0,
      graceMin: 0
    });
    const found = await Slot.find({ timetableId: timetable._id, startTime: '10:00' });
    expect(found.length).toBeGreaterThan(0);
  });
});
