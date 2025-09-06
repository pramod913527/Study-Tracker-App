// Session checkin controller
const { isWithinInterval, addMinutes } = require('date-fns');
const idempotencyMap = new Map(); // In-memory for demo

module.exports = (models) => ({
  startSession: async (req, res) => {
    const sessionId = req.params.id;
    const key = `start:${sessionId}`;
    if (idempotencyMap.has(key)) return res.json(idempotencyMap.get(key));
    const session = await models.Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Not found' });
    // Only allow start within 10 min before/after plannedStartTs
    const now = new Date();
    if (!isWithinInterval(now, { start: addMinutes(session.plannedStartTs, -10), end: addMinutes(session.plannedStartTs, 10) })) {
      return res.status(400).json({ error: 'Not in allowed start window' });
    }
    session.status = 'started';
    await session.save();
    idempotencyMap.set(key, { success: true, status: session.status });
    res.json({ success: true, status: session.status });
  },
  midCode: async (req, res) => {
    const sessionId = req.params.id;
    const key = `mid:${sessionId}`;
    if (idempotencyMap.has(key)) return res.json(idempotencyMap.get(key));
    const session = await models.Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Not found' });
    // Only allow mid-code if started
    if (session.status !== 'started') return res.status(400).json({ error: 'Session not started' });
    // (stub: mark as mid-checked)
    session.status = 'mid-checked';
    await session.save();
    idempotencyMap.set(key, { success: true, status: session.status });
    res.json({ success: true, status: session.status });
  },
  completeSession: async (req, res) => {
    const sessionId = req.params.id;
    const key = `complete:${sessionId}`;
    if (idempotencyMap.has(key)) return res.json(idempotencyMap.get(key));
    const session = await models.Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Not found' });
    // Only allow complete if started or mid-checked
    if (!['started', 'mid-checked'].includes(session.status)) return res.status(400).json({ error: 'Session not started or mid-checked' });
    session.status = 'completed';
    await session.save();
    idempotencyMap.set(key, { success: true, status: session.status });
    res.json({ success: true, status: session.status });
  }
});
