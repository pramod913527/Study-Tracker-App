// Timetable controller
module.exports = (models) => ({
  getTimetables: async (req, res) => {
    const ownerId = req.headers['x-user-id']; // For demo/testing
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    const tts = await models.Timetable.find({ ownerId });
    res.json(tts);
  },
  createTimetable: async (req, res) => {
    const ownerId = req.headers['x-user-id'];
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    try {
      const tt = await models.Timetable.create({ ...req.body, ownerId });
      res.status(201).json(tt);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  updateTimetable: async (req, res) => {
    const ownerId = req.headers['x-user-id'];
    if (!ownerId) return res.status(400).json({ error: 'ownerId required' });
    try {
      const tt = await models.Timetable.findOneAndUpdate(
        { _id: req.params.id, ownerId },
        req.body,
        { new: true }
      );
      if (!tt) return res.status(404).json({ error: 'Not found or forbidden' });
      res.json(tt);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
});
