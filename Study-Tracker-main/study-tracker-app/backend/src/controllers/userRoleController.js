
module.exports = (models) => ({
  grantRole: async (req, res) => {
    try {
  const { userId, orgId, role, grantedBy } = req.body;
  if (!grantedBy) return res.status(400).json({ error: 'grantedBy is required' });
  // Check if the role exists in the Role model
  const roleDef = await models.Role.findOne({ name: role });
  if (!roleDef) return res.status(400).json({ error: 'Role does not exist' });
  const grant = await models.UserRole.create({ userId, orgId, role, grantedBy });
  res.status(201).json(grant);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  revokeRole: async (req, res) => {
    try {
      const { userId, orgId, role } = req.body;
      const result = await models.UserRole.deleteOne({ userId, orgId, role });
      res.json({ success: result.deletedCount > 0 });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
});
