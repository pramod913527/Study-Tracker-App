const request = require('supertest');
const createApp = require('../index');

describe('WhatsApp Cloud API Adapter', () => {
  let app;
  beforeAll(() => {
    app = createApp({ mongooseConnection: {}, models: {} });
  });

  it('should verify webhook with correct token', async () => {
    const res = await request(app)
      .get('/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=12345');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('12345');
  });

  it('should reject webhook with wrong token', async () => {
    const res = await request(app)
      .get('/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=12345');
    expect(res.statusCode).toBe(403);
  });

  it('should send template and handle idempotency', async () => {
    const payload = { to: 'user1', template: 'welcome', data: { name: 'Test' }, idempotencyKey: 'abc123' };
    const res1 = await request(app).post('/whatsapp/send-template').send(payload);
    expect(['sent', 'idempotent']).toContain(res1.body.status);
    const res2 = await request(app).post('/whatsapp/send-template').send(payload);
    expect(res2.body.status).toBe('idempotent');
  });
});
