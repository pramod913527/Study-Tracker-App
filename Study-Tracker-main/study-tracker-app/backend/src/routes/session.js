module.exports = (models) => {
  const express = require('express');
  const router = express.Router();
  const sessionController = require('../controllers/sessionController')(models);

  router.post('/sessions/:id/start', sessionController.startSession);
  router.post('/sessions/:id/mid-code', sessionController.midCode);
  router.post('/sessions/:id/complete', sessionController.completeSession);

  return router;
};
