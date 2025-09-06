module.exports = (models) => {
  const express = require('express');
  const router = express.Router();
  const proofController = require('../controllers/proofController')(models);

  router.post('/proofs/upload-url', proofController.uploadUrl);

  return router;
};
