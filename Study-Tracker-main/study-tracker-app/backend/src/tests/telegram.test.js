const request = require('supertest');
const createApp = require('../index');

describe('Telegram Bot Adapter', () => {
  let app;
  beforeAll(() => {
    app = createApp({ mongooseConnection: {}, models: {} });
  });

  it('should send inline checkin button and handle idempotency', async () => {
    const payload = { to: 'user1', sessionId: 'sess123', idempotencyKey: 'inline1' };
    const res1 = await request(app).post('/telegram/send-inline-checkin').send(payload);
    expect(res1.body.status).toBe('sent');
    expect(res1.body.button).toBeDefined();
    const res2 = await request(app).post('/telegram/send-inline-checkin').send(payload);
    expect(res2.body.status).toBe('idempotent');
  });

  it('should send fallback message', async () => {
    const payload = { to: 'user1', message: 'Fallback message' };
    const res = await request(app).post('/telegram/send-fallback').send(payload);
    expect(res.body.status).toBe('sent');
    expect(res.body.action).toBe('fallback');
  });

  it('should handle webhook for inline checkin', async () => {
    const payload = { callback_query: { data: 'checkin:sess123' } };
    const res = await request(app).post('/telegram/webhook').send(payload);
    expect(res.body.ok).toBe(true);
    expect(res.body.result).toBe('checkin_triggered');
    expect(res.body.sessionId).toBe('sess123');
  });

  it('should handle webhook fallback for unknown callback', async () => {
    const payload = { callback_query: { data: 'unknown' } };
    const res = await request(app).post('/telegram/webhook').send(payload);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toBe('unknown or missing callback');
  });
});
