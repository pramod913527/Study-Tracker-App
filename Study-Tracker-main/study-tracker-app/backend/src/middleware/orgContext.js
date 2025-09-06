// Middleware stub for org context resolution
module.exports = (req, res, next) => {
  // In a real app, extract org from JWT/user/session
  // For now, allow orgId via header or query param for testing
  req.orgId = req.headers['x-org-id'] || req.query.orgId || null;
  next();
};
