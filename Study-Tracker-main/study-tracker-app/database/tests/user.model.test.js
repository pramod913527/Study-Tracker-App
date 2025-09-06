// Validation and CRUD tests for User model (Phase DB-01)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const User = require('../models/user');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a user with valid data', async () => {
    const user = await User.create({
      name: 'Test User',
      phone: '+911234567890',
      email: 'testuser@example.com'
    });
    expect(user._id).toBeDefined();
    expect(user.tz).toBe('Asia/Kolkata');
    expect(user.roles).toContain('student');
  });

    it('should not allow duplicate phone or email', async () => {
      await User.create({
        name: 'User1',
        phone: '+911111111111',
        email: 'user1@example.com'
      });
      let error = null;
      try {
        await User.create({
          name: 'User2',
          phone: '+911111111111',
          email: 'user2@example.com'
        });
      } catch (err) {
        error = err;
      }
      expect(error).toBeTruthy();
      expect(error.code).toBe(11000); // Mongo duplicate key error
      await expect(User.create({
        name: 'User3',
        phone: '+911222222222',
        email: 'user1@example.com'
      })).rejects.toThrow();
  });

  it('should validate phone and email format', async () => {
    await expect(User.create({
      name: 'BadPhone',
      phone: '123',
      email: 'badphone@example.com'
    })).rejects.toThrow();
    await expect(User.create({
      name: 'BadEmail',
      phone: '+911234567891',
      email: 'notanemail'
    })).rejects.toThrow();
  });
});
