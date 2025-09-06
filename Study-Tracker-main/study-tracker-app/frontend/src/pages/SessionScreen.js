import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';

export function SessionScreen({ sessionId }) {
  const [timer, setTimer] = useState(0);
  const [note, setNote] = useState('');
  const [otc, setOtc] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleStartTimer() {
    setTimer(1500); // 25 min
  }

  async function handleUploadProof(e) {
    setUploading(true);
    setError('');
    try {
      // 1. Get signed URL
      const res = await fetch('/api/proofs/upload-url', { method: 'POST', body: JSON.stringify({ sessionId }) });
      const { url, proofId } = await res.json();
      // 2. Upload file
      const file = e.target.files[0];
      await fetch(url, { method: 'PUT', body: file });
      setProofUrl(url.split('?')[0]);
      setProgress(100);
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleComplete() {
    // Call backend to complete session
    await fetch(`/api/sessions/${sessionId}/complete`, { method: 'POST', body: JSON.stringify({ otc, note, proofUrl }) });
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Session</h2>
      <div>Timer: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
      <Button onClick={handleStartTimer} disabled={timer > 0}>Start Timer</Button>
      <div style={{ margin: '16px 0' }}>
        <input type="file" onChange={handleUploadProof} disabled={uploading} />
        {progress > 0 && <progress value={progress} max={100} style={{ width: '100%' }} />}
        {proofUrl && <div>Proof uploaded: <a href={proofUrl} target="_blank" rel="noopener noreferrer">View</a></div>}
      </div>
      <div>
        <input value={otc} onChange={e => setOtc(e.target.value)} placeholder="Enter OTC" />
      </div>
      <div style={{ marginTop: 8 }}>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Session notes" style={{ width: '100%' }} />
      </div>
      <Button onClick={handleComplete} style={{ marginTop: 16 }}>Complete Session</Button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
