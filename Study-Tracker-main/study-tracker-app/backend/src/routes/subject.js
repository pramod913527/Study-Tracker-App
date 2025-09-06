module.exports = (models) => {
  const express = require('express');
  const router = express.Router();
  const subjectController = require('../controllers/subjectController')(models);
  const orgContext = require('../middleware/orgContext');

  router.get('/subjects', orgContext, subjectController.getSubjects);
  router.post('/subjects', orgContext, subjectController.createSubject);

  return router;
};
