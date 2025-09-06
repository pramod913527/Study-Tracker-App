module.exports = (models) => {
  const express = require('express');
  const router = express.Router();
  const timetableController = require('../controllers/timetableController')(models);

  router.get('/timetables', timetableController.getTimetables);
  router.post('/timetables', timetableController.createTimetable);
  router.put('/timetables/:id', timetableController.updateTimetable);

  return router;
};
