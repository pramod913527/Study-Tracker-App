// WhatsApp Cloud API Controller: template send and webhook verification
const WhatsAppCloudAdapter = require('../services/whatsappCloudAdapter');
const adapter = new WhatsAppCloudAdapter();

module.exports = {
  sendTemplate: async (req, res) => {
    const { to, template, data, idempotencyKey } = req.body;
    const result = await adapter.sendTemplate({ to, template, data, idempotencyKey });
    res.json(result);
  },
  webhookVerify: (req, res) => {
    adapter.verifyWebhook(req, res);
  }
};
