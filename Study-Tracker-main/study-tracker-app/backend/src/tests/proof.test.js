const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');

const { v4: uuidv4 } = require('uuid');

let app, models;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
  const Proof = mongoose.model('Proof', require('../../../database/models/proof').schema);
  models = { Proof };
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Proof Upload URL & Metadata', () => {
  it('should issue a signed URL and store proof metadata', async () => {
    const res = await request(app)
      .post('/proofs/upload-url')
      .send({ mime: 'image/png', userId: new mongoose.Types.ObjectId() });
    expect(res.statusCode).toBe(200);
    expect(res.body.url).toMatch(/^https:\/\/fake-s3.com\/bucket\//);
    expect(res.body.proof).toBeDefined();
    expect(res.body.proof.mime).toBe('image/png');
  });
});
