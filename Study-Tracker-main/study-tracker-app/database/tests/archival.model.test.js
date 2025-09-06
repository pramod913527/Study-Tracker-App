// Validation and CRUD tests for Archival model (Phase DB-20)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Archival = require('../models/archival');

describe('Archival Model', () => {
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

  it('should create an archival entry', async () => {
    const arch = await Archival.create({
      collection: 'sessions',
      documentId: new mongoose.Types.ObjectId(),
      data: { example: 'archived session data' },
      archivedAt: new Date(),
      restoreAvailable: true
    });
    expect(arch._id).toBeDefined();
    expect(arch.collection).toBe('sessions');
  });
});
