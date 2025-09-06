const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../index');

let app, models;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
  models = {};
  app = createApp({ mongooseConnection: mongoose.connection, models });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth Endpoints', () => {
  it('should request OTP', async () => {
    const res = await request(app)
      .post('/auth/request-otp')
      .send({ phone: '+911234567890' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.otp).toHaveLength(6);
  });

  it('should verify OTP and return tokens', async () => {
    // Request OTP first
    const reqRes = await request(app)
      .post('/auth/request-otp')
      .send({ phone: '+911234567891' });
    const otp = reqRes.body.otp;
    const res = await request(app)
      .post('/auth/verify-otp')
      .send({ phone: '+911234567891', otp });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('should fail to verify with wrong OTP', async () => {
    await request(app)
      .post('/auth/request-otp')
      .send({ phone: '+911234567892' });
    const res = await request(app)
      .post('/auth/verify-otp')
      .send({ phone: '+911234567892', otp: '000000' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid or expired OTP');
  });
});
