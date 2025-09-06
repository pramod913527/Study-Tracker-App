
module.exports = (models) => {
	const express = require('express');
	const router = express.Router();
	const orgController = require('../controllers/orgController')(models);
	const orgContext = require('../middleware/orgContext');

	router.get('/orgs', orgContext, orgController.getOrgs);
	router.post('/orgs', orgContext, orgController.createOrg);
	router.put('/orgs/:id/settings', orgContext, orgController.updateSettings);

	return router;
};
