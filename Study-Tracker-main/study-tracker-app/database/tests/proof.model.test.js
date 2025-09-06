// Validation and CRUD tests for Proof model (Phase DB-14)

const mongoose = require('mongoose');
jest.setTimeout(20000);
const Proof = require('../models/proof');
const User = require('../models/user');

describe('Proof Model', () => {
  let user;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/studytracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    user = await User.create({ name: 'ProofUser', phone: '+911234567899', email: 'proofuser@example.com' });
  });

  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  it('should create a proof entry', async () => {
    const proof = await Proof.create({
      url: 'https://example.com/proof.jpg',
      hash: 'hash123',
      checksum: 'chk456',
      uploadedBy: user._id,
      uploadedAt: new Date(),
      mime: 'image/jpeg',
      expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    expect(proof._id).toBeDefined();
    expect(proof.url).toBe('https://example.com/proof.jpg');
  });
});
