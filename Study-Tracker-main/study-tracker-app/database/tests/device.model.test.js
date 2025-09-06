// Validation and CRUD tests for Device model (Phase DB-16)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Device = require('../models/device');
const User = require('../models/user');

describe('Device Model', () => {
  let user;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    user = await User.create({ name: 'DeviceUser', phone: '+911234567900', email: 'deviceuser@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a device entry', async () => {
    const device = await Device.create({
      deviceId: 'device-002',
      userId: user._id,
      platform: 'iOS',
      lastSeen: new Date(),
      deviceTrustFlag: false
    });
    expect(device._id).toBeDefined();
    expect(device.deviceId).toBe('device-002');
  });

  it('should not allow duplicate deviceId', async () => {
    await Device.create({ deviceId: 'device-003', userId: user._id });
    await expect(Device.create({ deviceId: 'device-003', userId: user._id })).rejects.toThrow();
  });
});
