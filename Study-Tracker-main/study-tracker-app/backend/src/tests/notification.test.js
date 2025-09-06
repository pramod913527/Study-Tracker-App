const request = require('supertest');
const createApp = require('../index');

describe('Notification Service', () => {
  let app;
  beforeAll(() => {
    app = createApp({ mongooseConnection: {}, models: {} });
  });

  it('should send test notification and log delivery', async () => {
    const res = await request(app)
      .post('/notify/test')
      .send({ to: 'user1', message: 'Hello test!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logs.length).toBeGreaterThan(0);
    expect(res.body.logs[0].notification.message).toBe('Hello test!');
  });

  it('should return delivery logs', async () => {
    const res = await request(app).get('/notify/logs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.logs)).toBe(true);
  });
});
