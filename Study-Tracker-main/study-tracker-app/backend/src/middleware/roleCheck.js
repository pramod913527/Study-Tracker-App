// Middleware to check if user has required role
module.exports = function(requiredRoles = []) {
  return (req, res, next) => {
    // In real app, extract user from JWT
    // For test/demo, allow role via header or default to 'developer'
    const userRole = req.headers['x-user-role'] || 'developer';
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
};
