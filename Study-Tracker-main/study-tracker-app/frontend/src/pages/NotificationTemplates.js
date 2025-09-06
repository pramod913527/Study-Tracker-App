import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { cachedFetch } from '../utils/cache';

export function NotificationTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ message: '', channel: 'email' });
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTemplates() {
      const res = await cachedFetch('/api/notifications/templates');
      setTemplates(res);
    }
    fetchTemplates();
  }, []);

  function handleEdit(t) {
    setSelected(t.id);
    setForm({ message: t.message, channel: t.channel });
    setError('');
  }

  async function handleSave() {
    setError('');
    try {
      await fetch('/api/notifications/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected, ...form }),
      });
      setSelected(null);
    } catch {
      setError('Failed to save template');
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Notification Templates</h2>
      <ul>
        {templates.map(t => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>{t.channel.toUpperCase()}:</span> {t.message.replace(/\{\w+\}/g, m => <b>{m}</b>)}
            <Button onClick={() => handleEdit(t)} style={{ marginLeft: 8 }}>Edit</Button>
          </li>
        ))}
      </ul>
      {selected && (
        <div style={{ marginTop: 16, border: '1px solid #ccc', borderRadius: 4, padding: 16 }}>
          <div>
            <label>Channel: <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select></label>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Message: <input value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ width: '100%' }} /></label>
          </div>
          <Button onClick={handleSave} style={{ marginTop: 12 }}>Save</Button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </div>
      )}
    </div>
  );
}
