import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { connectSocket } from '../utils/socket';

export function MentorClassView() {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ risk: '', subject: '' });
  const [bulkStatus, setBulkStatus] = useState('');
  const [classUpdates, setClassUpdates] = useState([]);

  useEffect(() => {
    async function fetchClasses() {
      const res = await fetch('/api/mentor/classes');
      setClasses(await res.json());
    }
    fetchClasses();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const socket = connectSocket(token);
    socket.on('classUpdate', update => setClassUpdates(prev => [update, ...prev]));
    return () => { socket.off('classUpdate'); };
  }, []);

  async function handleBulkNudge() {
    setBulkStatus('Sending...');
    await fetch('/api/mentor/bulk-nudge', { method: 'POST', body: JSON.stringify({ classId: selected, filter }) });
    setBulkStatus('Nudge sent!');
    setTimeout(() => setBulkStatus(''), 2000);
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Mentor Class View</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Filter by Risk: <select value={filter.risk} onChange={e => setFilter(f => ({ ...f, risk: e.target.value }))}>
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select></label>
        <label style={{ marginLeft: 16 }}>Subject: <input value={filter.subject} onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))} /></label>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {classes.filter(c => (!filter.risk || c.risk === filter.risk) && (!filter.subject || c.subject.includes(filter.subject))).map(c => (
          <div key={c.id} style={{ border: '1px solid #ccc', borderRadius: 4, padding: 16, minWidth: 180, background: selected === c.id ? '#e3f2fd' : '#fff' }} onClick={() => setSelected(c.id)}>
            <div><b>{c.name}</b></div>
            <div>Subject: {c.subject}</div>
            <div>Risk: {c.risk}</div>
            <div>Students: {c.studentCount}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <Button onClick={handleBulkNudge} disabled={!selected}>Bulk Nudge</Button>
        {bulkStatus && <span style={{ marginLeft: 16 }}>{bulkStatus}</span>}
      </div>
    </div>
  );
}
