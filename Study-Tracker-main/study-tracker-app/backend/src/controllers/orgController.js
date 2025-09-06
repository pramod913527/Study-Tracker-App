
module.exports = (models) => ({
  getOrgs: async (req, res) => {
    const orgs = await models.Org.find();
    res.json(orgs);
  },
  createOrg: async (req, res) => {
    try {
      const org = await models.Org.create(req.body);
      res.status(201).json(org);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  updateSettings: async (req, res) => {
    try {
      const orgId = req.params.id;
      const settings = await models.Settings.findOneAndUpdate(
        { orgId },
        req.body,
        { new: true, upsert: true }
      );
      res.json(settings);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
});
