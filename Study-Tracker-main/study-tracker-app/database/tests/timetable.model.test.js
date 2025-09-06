// Validation and CRUD tests for Timetable model (Phase DB-06)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Timetable = require('../models/timetable');
const User = require('../models/user');

describe('Timetable Model', () => {
  let user;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    user = await User.create({ name: 'TimetableUser', phone: '+911234567893', email: 'ttuser@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a timetable with valid data', async () => {
    const tt = await Timetable.create({
      ownerId: user._id,
      title: 'My Timetable',
      visibility: 'private',
      tz: 'Asia/Kolkata',
      settings: { weekStart: 'Monday' }
    });
    expect(tt._id).toBeDefined();
    expect(tt.title).toBe('My Timetable');
  });

    it('should not allow duplicate timetable title for same owner', async () => {
      await Timetable.create({ ownerId: user._id, title: 'UniqueTT' });
      let error = null;
      try {
        await Timetable.create({ ownerId: user._id, title: 'UniqueTT' });
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeNull();
      expect(error.code).toBe(11000);
    });
});
