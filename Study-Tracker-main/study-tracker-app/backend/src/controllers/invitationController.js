
const crypto = require('crypto');

module.exports = (models) => ({
  createInvitation: async (req, res) => {
    try {
      const { orgId, inviterId, inviteeContact, role, expiresAt } = req.body;
      if (!orgId || !inviterId || !inviteeContact || !role || !expiresAt) {
        return res.status(400).json({ error: 'orgId, inviterId, inviteeContact, role, and expiresAt are required' });
      }
      const token = crypto.randomBytes(16).toString('hex');
  const invitation = await models.Invitation.create({ orgId, inviterId, inviteeContact, role, expiresAt, token });
  // Stub: Outbound message (e.g., email/SMS)
  console.log(`[INVITE STUB] Send invitation to ${inviteeContact} for org ${orgId} with token ${token}`);
  res.status(201).json(invitation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  getInvitation: async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await models.Invitation.findOne({ token });
      if (!invitation) return res.status(404).json({ error: 'Not found' });
      res.json(invitation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  acceptInvitation: async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await models.Invitation.findOne({ token });
      if (!invitation) return res.status(404).json({ error: 'Not found' });
      // Require phone in the payload
      const { name, phone } = req.body;
      if (!phone) return res.status(400).json({ error: 'Phone is required to accept invitation.' });
      // Create user and role
      const user = await models.User.create({
        email: invitation.inviteeContact,
        name: name || invitation.inviteeContact,
        phone
      });
      await models.UserRole.create({
        userId: user._id,
        orgId: invitation.orgId,
        role: invitation.role,
        grantedBy: invitation.inviterId
      });
      invitation.status = 'accepted';
      await invitation.save();
      res.json({ user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
});
