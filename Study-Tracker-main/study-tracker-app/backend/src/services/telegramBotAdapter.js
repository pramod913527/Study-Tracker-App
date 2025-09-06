// Telegram Bot Adapter with inline action support and fallback flows (mocked)
const sentActions = new Map(); // idempotency

class TelegramBotAdapter {
  constructor() {
    this.channel = 'telegram';
  }

  async sendInlineCheckin({ to, sessionId, idempotencyKey }) {
    // Idempotency check
    if (idempotencyKey && sentActions.has(idempotencyKey)) {
      return { status: 'idempotent', channel: this.channel };
    }
    // Simulate sending inline button
    if (idempotencyKey) sentActions.set(idempotencyKey, true);
    return {
      status: 'sent',
      channel: this.channel,
      action: 'inline_checkin',
      to,
      sessionId,
      button: {
        text: 'Check In',
        callback_data: `checkin:${sessionId}`
      }
    };
  }

  // Fallback flow (mock)
  async sendFallback({ to, message }) {
    return {
      status: 'sent',
      channel: this.channel,
      action: 'fallback',
      to,
      message
    };
  }

  // Simulate Telegram webhook for button press
  handleWebhook(req, res) {
    const { callback_query } = req.body;
    if (callback_query && callback_query.data && callback_query.data.startsWith('checkin:')) {
      // Simulate checkin flow
      res.json({ ok: true, result: 'checkin_triggered', sessionId: callback_query.data.split(':')[1] });
    } else {
      res.json({ ok: false, error: 'unknown or missing callback' });
    }
  }
}

module.exports = TelegramBotAdapter;
