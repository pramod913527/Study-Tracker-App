// Slot controller with overlap validation and recurrence support
const parseTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

function overlaps(a, b) {
  return parseTime(a.startTime) < parseTime(b.endTime) && parseTime(b.startTime) < parseTime(a.endTime);
}

module.exports = (models) => ({
  createSlot: async (req, res) => {
    const timetableId = req.params.id;
    const { subjectId, startTime, endTime, recurrence = [] } = req.body;
    // Validate overlap
    const existing = await models.Slot.find({ timetableId });
    for (const slot of existing) {
      // Overlap if any weekday matches and times overlap
      if (recurrence.some(day => slot.recurrence.includes(day)) && overlaps({ startTime, endTime }, slot)) {
        return res.status(400).json({ error: 'Slot overlaps with existing slot' });
      }
    }
    try {
      const slot = await models.Slot.create({ ...req.body, timetableId });
      res.status(201).json(slot);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  updateSlot: async (req, res) => {
    const slotId = req.params.id;
    try {
      const slot = await models.Slot.findByIdAndUpdate(slotId, req.body, { new: true });
      if (!slot) return res.status(404).json({ error: 'Not found' });
      res.json(slot);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  deleteSlot: async (req, res) => {
    const slotId = req.params.id;
    await models.Slot.findByIdAndDelete(slotId);
    res.json({ success: true });
  }
});
