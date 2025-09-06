// Notification routes
const express = require('express');
const controller = require('../controllers/notificationController');

module.exports = () => {
  const router = express.Router();
  router.post('/notify/test', controller.testNotify);
  router.get('/notify/logs', controller.getLogs);
  return router;
};
