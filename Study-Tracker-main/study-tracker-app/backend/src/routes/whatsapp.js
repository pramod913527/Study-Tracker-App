// WhatsApp Cloud API routes
const express = require('express');
const controller = require('../controllers/whatsappController');

module.exports = () => {
  const router = express.Router();
  router.post('/whatsapp/send-template', controller.sendTemplate);
  router.get('/whatsapp/webhook', controller.webhookVerify);
  return router;
};
