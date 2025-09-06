// WhatsApp Cloud API Adapter with template sending, webhook verification, retries, idempotency (mocked)
const sentTemplates = new Map(); // idempotency

class WhatsAppCloudAdapter {
  constructor() {
    this.channel = 'whatsapp-cloud';
    this.retryLimit = 2;
  }

  async sendTemplate({ to, template, data, idempotencyKey }) {
    // Idempotency check
    if (idempotencyKey && sentTemplates.has(idempotencyKey)) {
      return { status: 'idempotent', channel: this.channel };
    }
    // Simulate retries
    let attempt = 0;
    let lastError = null;
    while (attempt <= this.retryLimit) {
      attempt++;
      // Simulate random failure for first attempt
      if (attempt === 1 && Math.random() < 0.5) {
        lastError = 'Simulated send failure';
        continue;
      }
      // Success
      if (idempotencyKey) sentTemplates.set(idempotencyKey, true);
      return { status: 'sent', channel: this.channel, attempt };
    }
    return { status: 'failed', channel: this.channel, error: lastError };
  }

  // Webhook verification (mock)
  verifyWebhook(req, res) {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'test-token';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
}

module.exports = WhatsAppCloudAdapter;
