module.exports = (models) => {
  const express = require('express');
  const router = express.Router();
  const slotController = require('../controllers/slotController')(models);

  router.post('/timetables/:id/slots', slotController.createSlot);
  router.put('/slots/:id', slotController.updateSlot);
  router.delete('/slots/:id', slotController.deleteSlot);

  return router;
};
