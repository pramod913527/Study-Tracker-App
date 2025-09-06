// Session materialization job (nightly or on-demand)
const { addDays, format } = require('date-fns');

module.exports = async function materializeSessions({ models, timetableId, startDate, days = 7, orgId, studentId }) {
  // Find slots for the timetable
  const slots = await models.Slot.find({ timetableId });
  const sessions = [];
  for (let i = 0; i < days; ++i) {
    const dateObj = addDays(new Date(startDate), i);
    const dateStr = format(dateObj, 'yyyy-MM-dd');
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., 'Mon'
    for (const slot of slots) {
      if (slot.recurrence.includes(weekday)) {
        // Compute planned start/end timestamps
        const [sh, sm] = slot.startTime.split(':').map(Number);
        const [eh, em] = slot.endTime.split(':').map(Number);
        const plannedStartTs = new Date(dateObj);
        plannedStartTs.setHours(sh, sm, 0, 0);
        const plannedEndTs = new Date(dateObj);
        plannedEndTs.setHours(eh, em, 0, 0);
        sessions.push({
          slotId: slot._id,
          date: dateStr,
          plannedStartTs,
          plannedEndTs,
          orgId,
          studentId,
          status: 'planned'
        });
      }
    }
  }
  // Exclude holidays (stub: none)
  await models.Session.insertMany(sessions);
  return sessions;
};
