import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';

export function StudentHome() {
  const [slot, setSlot] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [otc, setOtc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch current slot from backend
    async function fetchSlot() {
      try {
        const res = await fetch('/api/slots/current');
        const data = await res.json();
        setSlot(data);
        setProgress(data.progress || 0);
        setStatus(data.status || 'idle');
      } catch {
        setError('Failed to load slot');
      }
    }
    fetchSlot();
  }, []);

  async function handleStart() {
    setStatus('starting');
    setError('');
    try {
      await fetch(`/api/sessions/${slot.id}/start`, { method: 'POST' });
      setStatus('in_progress');
      setProgress(10);
    } catch {
      setError('Failed to start session');
      setStatus('idle');
    }
  }

  async function handleDone() {
    setStatus('completing');
    setError('');
    try {
      await fetch(`/api/sessions/${slot.id}/complete`, { method: 'POST', body: JSON.stringify({ otc }) });
      setStatus('done');
      setProgress(100);
    } catch {
      setError('Failed to complete session');
      setStatus('in_progress');
    }
  }

  if (!slot) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Current Slot</h2>
      <div><b>Subject:</b> {slot.subject}</div>
      <div><b>Time:</b> {slot.time}</div>
      <div style={{ margin: '16px 0' }}>
        <progress value={progress} max={100} style={{ width: '100%' }} />
      </div>
      {status === 'idle' && <Button onClick={handleStart}>Start</Button>}
      {status === 'in_progress' && (
        <>
          <input value={otc} onChange={e => setOtc(e.target.value)} placeholder="Enter OTC" style={{ marginRight: 8 }} />
          <Button onClick={handleDone}>Done</Button>
        </>
      )}
      {status === 'done' && <div>Session complete!</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
