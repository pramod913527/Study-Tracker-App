// Telegram Bot API routes
const express = require('express');
const controller = require('../controllers/telegramController');

module.exports = () => {
  const router = express.Router();
  router.post('/telegram/send-inline-checkin', controller.sendInlineCheckin);
  router.post('/telegram/send-fallback', controller.sendFallback);
  router.post('/telegram/webhook', controller.webhook);
  return router;
};
