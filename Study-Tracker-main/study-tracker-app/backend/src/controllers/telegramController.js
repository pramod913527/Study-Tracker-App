// Telegram Bot Controller: inline checkin, fallback, webhook
const TelegramBotAdapter = require('../services/telegramBotAdapter');
const adapter = new TelegramBotAdapter();

module.exports = {
  sendInlineCheckin: async (req, res) => {
    const { to, sessionId, idempotencyKey } = req.body;
    const result = await adapter.sendInlineCheckin({ to, sessionId, idempotencyKey });
    res.json(result);
  },
  sendFallback: async (req, res) => {
    const { to, message } = req.body;
    const result = await adapter.sendFallback({ to, message });
    res.json(result);
  },
  webhook: (req, res) => {
    adapter.handleWebhook(req, res);
  }
};
