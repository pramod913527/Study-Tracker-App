// Security middleware: rate limit, IP throttling, JWT rotation, secure headers
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

// Rate limiter (per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

// JWT rotation and refresh (stub)
function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'test');
    req.user = payload;
    // Simulate rotation: issue new token if expiring soon
    if (payload.exp && payload.exp - Date.now() / 1000 < 60 * 5) {
      const newToken = jwt.sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, process.env.JWT_SECRET || 'test');
      res.set('x-jwt-rotated', newToken);
    }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { limiter, helmet, jwtAuth };
