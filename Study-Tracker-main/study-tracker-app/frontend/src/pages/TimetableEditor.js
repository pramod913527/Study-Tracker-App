import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

function getEmptySlots() {
  return Array.from({ length: 24 }, (_, h) => ({ hour: h, slot: null }));
}

export function TimetableEditor() {
  const [slots, setSlots] = useState(getEmptySlots());
  const [modalOpen, setModalOpen] = useState(false);
  const [editHour, setEditHour] = useState(null);
  const [form, setForm] = useState({ subject: '', recurrence: 'none' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Load slots from backend
    async function fetchSlots() {
      const res = await fetch('/api/timetable');
      const data = await res.json();
      const filled = getEmptySlots();
      data.forEach(slot => { filled[slot.hour].slot = slot; });
      setSlots(filled);
    }
    fetchSlots();
  }, []);

  function openModal(hour) {
    setEditHour(hour);
    setForm({ subject: slots[hour].slot?.subject || '', recurrence: slots[hour].slot?.recurrence || 'none' });
    setModalOpen(true);
    setError('');
  }

  async function handleSave() {
    setError('');
    // Overlap validation: only one slot per hour
    if (slots[editHour].slot && slots[editHour].slot.subject !== form.subject) {
      setError('Slot already exists for this hour.');
      return;
    }
    try {
      await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hour: editHour, ...form }),
      });
      setSlots(slots => {
        const updated = [...slots];
        updated[editHour] = { hour: editHour, slot: { hour: editHour, ...form } };
        return updated;
      });
      setModalOpen(false);
    } catch {
      setError('Failed to save slot');
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Timetable Editor</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {slots.map(({ hour, slot }) => (
          <div key={hour} style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8, background: slot ? '#e3f2fd' : '#fafbfc', cursor: 'pointer' }} onClick={() => openModal(hour)}>
            <div><b>{hour}:00</b></div>
            <div>{slot ? slot.subject : <span style={{ color: '#bbb' }}>Empty</span>}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{slot?.recurrence}</div>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editHour !== null ? `Edit Slot: ${editHour}:00` : 'Add Slot'}>
        <div>
          <label>Subject: <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Recurrence: 
            <select value={form.recurrence} onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))}>
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <Button onClick={handleSave} style={{ marginTop: 16 }}>Save</Button>
      </Modal>
    </div>
  );
}
