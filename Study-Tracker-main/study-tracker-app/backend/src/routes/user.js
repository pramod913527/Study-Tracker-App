
module.exports = (models) => {
	const express = require('express');
	const router = express.Router();
	const userController = require('../controllers/userController')(models);
	const userRoleController = require('../controllers/userRoleController')(models);
	const roleCheck = require('../middleware/roleCheck');

	router.get('/users', userController.getUsers);
	router.post('/users', userController.createUser);
	router.post('/user-roles/grant', roleCheck(['developer', 'admin']), userRoleController.grantRole);
	router.post('/user-roles/revoke', roleCheck(['developer', 'admin']), userRoleController.revokeRole);

	return router;
};
