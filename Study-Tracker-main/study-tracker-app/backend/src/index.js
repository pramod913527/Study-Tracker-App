


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Accept injected mongoose connection and models
function createApp({ mongooseConnection, models }) {
	const { limiter, helmet, jwtAuth } = require('./middleware/security');
	const logger = require('./observability/logger');
	const { metricsMiddleware, metricsEndpoint } = require('./observability/metrics');
	const app = express();
	app.use(helmet());
	app.use(limiter);
	app.use(cors());
	app.use(express.json());
	app.use(morgan('dev'));
	app.use(metricsMiddleware);

	// Example: log all requests
	app.use((req, res, next) => {
		logger.info({ method: req.method, url: req.url, user: req.user?.id });
		next();
	});
	// Prometheus metrics endpoint
	app.get('/metrics', metricsEndpoint);

	// Admin & Audit API routes
	const auditRoutes = require('./routes/audit')(models);
	app.use(auditRoutes);

	// Billing API routes
	const billingRoutes = require('./routes/billing')();
	app.use(billingRoutes);

	// Telegram Bot API routes
	const telegramRoutes = require('./routes/telegram')();
	app.use(telegramRoutes);

	// WhatsApp Cloud API routes
	const whatsappRoutes = require('./routes/whatsapp')();
	app.use(whatsappRoutes);

	// Notification routes
	const notificationRoutes = require('./routes/notification')();
	app.use(notificationRoutes);

	// Health check
	app.get('/health', (req, res) => res.json({ status: 'ok' }));

	// Auth routes
	const authRoutes = require('./routes/auth')(models);
	app.use('/auth', authRoutes);

	// User & Role routes
	const userRoutes = require('./routes/user')(models);
	app.use(userRoutes);

	// Org & Settings routes
	const orgRoutes = require('./routes/org')(models);
	app.use(orgRoutes);

	// Invitation routes
	const invitationRoutes = require('./routes/invitation')(models);
	app.use(invitationRoutes);

	// Subject routes
	const subjectRoutes = require('./routes/subject')(models);
	app.use(subjectRoutes);

	// Timetable routes
	const timetableRoutes = require('./routes/timetable')(models);
	app.use(timetableRoutes);

	// Slot routes
	const slotRoutes = require('./routes/slot')(models);
	app.use(slotRoutes);

	// Session routes
	const sessionRoutes = require('./routes/session')(models);
	app.use(sessionRoutes);

	// Proof routes
	const proofRoutes = require('./routes/proof')(models);
	app.use(proofRoutes);
		return app;
}

module.exports = createApp;
