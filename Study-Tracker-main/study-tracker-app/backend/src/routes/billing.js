// Billing API routes
const express = require('express');
const billingService = require('../services/billingService');

module.exports = () => {
  const router = express.Router();
  router.post('/billing/webhook', (req, res) => billingService.handleWebhook(req, res));
  return router;
};
