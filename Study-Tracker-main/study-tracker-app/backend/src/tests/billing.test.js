const request = require('supertest');
const createApp = require('../index');
const billingService = require('../services/billingService');

describe('Billing & Plan Enforcement', () => {
  let app;
  beforeAll(() => {
    app = createApp({ mongooseConnection: {}, models: {} });
  });

  it('should handle billing webhook and update plan', async () => {
    const res = await request(app).post('/billing/webhook').send({ orgId: 'org1', plan: 'pro' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(billingService.subscriptions.get('org1')).toBe('pro');
  });

  it('should enforce plan limits for free and pro', async () => {
    billingService.subscriptions.set('org2', 'free');
    billingService.subscriptions.set('org3', 'pro');
    expect(billingService.checkLimit('org2', 'students', 2)).toBe(true);
    expect(billingService.checkLimit('org2', 'students', 4)).toBe(false);
    expect(billingService.checkLimit('org3', 'students', 50)).toBe(true);
    expect(billingService.checkLimit('org3', 'students', 101)).toBe(false);
  });
});
