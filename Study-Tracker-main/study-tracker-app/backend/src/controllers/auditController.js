// Admin & Audit APIs: GET /audit, POST /roles/grant, GET /webhook/logs
module.exports = (models) => ({
  getAuditLogs: async (req, res) => {
    // TODO: add admin auth check
    const logs = await models.AuditLog.find({}).sort({ ts: -1 }).limit(100);
    res.json({ logs });
  },
  grantRole: async (req, res) => {
    // TODO: add admin auth check
    const { userId, role } = req.body;
    const actorId = userId; // For demo, use userId as actorId
  const orgId = req.body.orgId || null;
  const grantedBy = req.body.grantedBy || actorId;
  await models.UserRole.create({ userId, role, orgId, grantedBy });
    await models.AuditLog.create({
      actorId,
      actionType: 'grant_role',
      resourceType: 'UserRole',
      resourceId: userId,
      before: {},
      after: { role },
      ts: new Date()
    });
    res.json({ success: true });
  },
  getWebhookLogs: async (req, res) => {
    // TODO: add admin auth check
    const logs = await models.AuditLog.find({ actionType: 'webhook' }).sort({ ts: -1 }).limit(100);
    res.json({ logs });
  }
});
