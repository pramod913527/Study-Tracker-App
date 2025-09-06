// Notification Controller: POST /notify/test and internal notification trigger
const {
  NotificationService,
  WhatsAppAdapter,
  TelegramAdapter,
  FCMAdapter,
  EmailAdapter
} = require('../services/notificationService');

// Singleton notification service with all adapters registered
const notificationService = new NotificationService();
notificationService.registerAdapter(new WhatsAppAdapter());
notificationService.registerAdapter(new TelegramAdapter());
notificationService.registerAdapter(new FCMAdapter());
notificationService.registerAdapter(new EmailAdapter());

module.exports = {
  testNotify: async (req, res) => {
    const { to, message } = req.body;
    await notificationService.send({ to, message, type: 'test' });
    res.json({ success: true, logs: notificationService.getLogs() });
  },
  notifyOnCheckin: async (event) => {
    // Internal call for checkin events
    await notificationService.send({
      to: event.userId,
      message: `Checkin event: ${event.type}`,
      type: 'checkin',
      event
    });
  },
  getLogs: (req, res) => {
    res.json({ logs: notificationService.getLogs() });
  }
};
