import React, { useState, useEffect } from 'react';

function getColor(count) {
  if (count === 0) return '#eee';
  if (count < 2) return '#b3e5fc';
  if (count < 4) return '#4fc3f7';
  return '#0288d1';
}

export function History() {
  const [calendar, setCalendar] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    // Fetch calendar heatmap data
    async function fetchCalendar() {
      const res = await fetch('/api/history/calendar');
      const data = await res.json();
      setCalendar(data);
    }
    fetchCalendar();
  }, []);

  async function handleDayClick(day) {
    setSelectedDay(day);
    // Fetch sessions for the day
    const res = await fetch(`/api/history/${day}`);
    const data = await res.json();
    setSessions(data);
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>History</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 24 }}>
        {calendar.map(day => (
          <div key={day.date} onClick={() => handleDayClick(day.date)} style={{ background: getColor(day.count), height: 24, borderRadius: 4, cursor: 'pointer' }} title={day.date}></div>
        ))}
      </div>
      {selectedDay && (
        <div>
          <h3>Sessions for {selectedDay}</h3>
          <ul>
            {sessions.map(s => (
              <li key={s.id}>{s.subject} ({s.time})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
