import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { connectSocket } from '../utils/socket';

export function GuardianDashboard() {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [quietHours, setQuietHours] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const sRes = await fetch('/api/guardian/students');
      setStudents(await sRes.json());
      const nRes = await fetch('/api/guardian/notifications');
      setNotifications(await nRes.json());
    }
    fetchData();
    // Polling for real-time updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const socket = connectSocket(token);
    socket.on('notification', n => setNotifications(prev => [n, ...prev]));
    return () => { socket.off('notification'); };
  }, []);

  async function toggleQuietHours() {
    setQuietHours(q => !q);
    await fetch('/api/guardian/quiet-hours', { method: 'POST', body: JSON.stringify({ enabled: !quietHours }) });
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Guardian Dashboard</h2>
      <div style={{ marginBottom: 24 }}>
        <Button onClick={toggleQuietHours}>{quietHours ? 'Disable' : 'Enable'} Quiet Hours</Button>
      </div>
      <h3>Students</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {students.map(s => (
          <div key={s.id} style={{ border: '1px solid #ccc', borderRadius: 4, padding: 16, minWidth: 180 }}>
            <div><b>{s.name}</b></div>
            <div>Status: {s.status}</div>
            <div>Last Session: {s.lastSession}</div>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 32 }}>Notifications</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id}>{n.message} <span style={{ color: '#888', fontSize: 12 }}>({n.time})</span></li>
        ))}
      </ul>
    </div>
  );
}
