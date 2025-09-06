// Admin & Audit API routes
const express = require('express');
const controllerFactory = require('../controllers/auditController');

module.exports = (models) => {
  const router = express.Router();
  const controller = controllerFactory(models);
  router.get('/audit', controller.getAuditLogs);
  router.post('/roles/grant', controller.grantRole);
  router.get('/webhook/logs', controller.getWebhookLogs);
  return router;
};
