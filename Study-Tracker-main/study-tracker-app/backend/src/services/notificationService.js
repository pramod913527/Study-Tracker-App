// Notification Service Abstraction with Channel Adapters (WhatsApp, Telegram, FCM, Email)
const deliveryLog = [];

class NotificationService {
  constructor() {
    this.adapters = [];
  }

  registerAdapter(adapter) {
    this.adapters.push(adapter);
  }

  async send(notification) {
    // Simulate queue-based send
    for (const adapter of this.adapters) {
      const result = await adapter.send(notification);
      deliveryLog.push({
        channel: adapter.channel,
        notification,
        result,
        timestamp: new Date()
      });
    }
  }

  getLogs() {
    return deliveryLog;
  }
}

// Example Adapters
class WhatsAppAdapter {
  constructor() { this.channel = 'whatsapp'; }
  async send(notification) { return { status: 'sent', channel: this.channel }; }
}
class TelegramAdapter {
  constructor() { this.channel = 'telegram'; }
  async send(notification) { return { status: 'sent', channel: this.channel }; }
}
class FCMAdapter {
  constructor() { this.channel = 'fcm'; }
  async send(notification) { return { status: 'sent', channel: this.channel }; }
}
class EmailAdapter {
  constructor() { this.channel = 'email'; }
  async send(notification) { return { status: 'sent', channel: this.channel }; }
}

module.exports = {
  NotificationService,
  WhatsAppAdapter,
  TelegramAdapter,
  FCMAdapter,
  EmailAdapter
};
