// Analytics Aggregation Jobs: daily metrics per student (mocked)
const mongoose = require('mongoose');

let Session, MetricsDaily;
function setModels({ SessionModel, MetricsDailyModel }) {
  Session = SessionModel;
  MetricsDaily = MetricsDailyModel;
}

// Aggregate daily metrics per student
async function aggregateDailyMetrics(date) {
  if (!Session || !MetricsDaily) throw new Error('Models not set');
  // Default to today
  const day = date ? new Date(date) : new Date();
  day.setHours(0,0,0,0);
  const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
  // Find all sessions for the day
  const sessions = await Session.find({ plannedStartTs: { $gte: day, $lt: nextDay } });
  // Group by student
  const byStudent = {};
  for (const session of sessions) {
    if (!byStudent[session.studentId]) byStudent[session.studentId] = [];
    byStudent[session.studentId].push(session);
  }
  // Aggregate and upsert
  for (const studentId in byStudent) {
    const sessionsArr = byStudent[studentId];
    const completed = sessionsArr.filter(s => s.status === 'completed').length;
    const missed = sessionsArr.filter(s => s.status !== 'completed').length;
    await MetricsDaily.updateOne(
      { studentId, date: day.toISOString().slice(0,10) },
      { $set: { completed, missed, total: sessionsArr.length } },
      { upsert: true }
    );
  }
}

module.exports = { setModels, aggregateDailyMetrics };
