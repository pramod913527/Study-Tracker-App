// Billing & Plan Enforcement: webhooks, subscription checks, plan limits (stubbed)
const billingLog = [];
const planLimits = {
  free: { students: 3 },
  pro: { students: 100 }
};

class BillingService {
  constructor() {
    this.subscriptions = new Map(); // orgId -> plan
  }

  // Simulate webhook from payment provider
  async handleWebhook(req, res) {
    const { orgId, plan } = req.body;
    this.subscriptions.set(orgId, plan);
    billingLog.push({ orgId, plan, event: 'webhook', timestamp: new Date() });
    res.json({ success: true });
  }

  // Check if org is within plan limits
  checkLimit(orgId, feature, count) {
    const plan = this.subscriptions.get(orgId) || 'free';
    const limit = planLimits[plan][feature];
    return count <= limit;
  }

  getLog() {
    return billingLog;
  }
}

module.exports = new BillingService();
