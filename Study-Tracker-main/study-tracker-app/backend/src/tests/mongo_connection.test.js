const mongoose = require('mongoose');

describe('MongoDB Connection', () => {
  it('should connect and perform a simple operation', async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {});
    const admin = await mongoose.connection.db.admin().serverStatus();
    expect(admin.ok).toBe(1);
    await mongoose.disconnect();
  });
});
