// Subject controller
module.exports = (models) => ({
  getSubjects: async (req, res) => {
    const orgId = req.orgId;
    if (!orgId) return res.status(400).json({ error: 'orgId required' });
    const subjects = await models.Subject.find({ orgId });
    res.json(subjects);
  },
  createSubject: async (req, res) => {
    const orgId = req.orgId;
    if (!orgId) return res.status(400).json({ error: 'orgId required' });
    try {
      const subject = await models.Subject.create({ ...req.body, orgId });
      res.status(201).json(subject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
});
