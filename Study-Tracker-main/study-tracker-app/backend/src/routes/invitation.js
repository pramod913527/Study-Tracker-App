
module.exports = (models) => {
	const express = require('express');
	const router = express.Router();
	const invitationController = require('../controllers/invitationController')(models);

	router.post('/invitations', invitationController.createInvitation);
	router.get('/invitations/:token', invitationController.getInvitation);
	router.post('/invitations/:token/accept', invitationController.acceptInvitation);

	return router;
};
