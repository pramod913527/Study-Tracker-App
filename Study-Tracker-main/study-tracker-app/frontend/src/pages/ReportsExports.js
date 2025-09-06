import React, { useState } from 'react';
import { Button } from '../components/Button';
import { cachedFetch } from '../utils/cache';

export function ReportsExports() {
  const [range, setRange] = useState({ from: '', to: '' });
  const [type, setType] = useState('student');
  const [preview, setPreview] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  async function handlePreview() {
    setError('');
    try {
      const res = await cachedFetch(`/api/reports/preview?from=${range.from}&to=${range.to}&type=${type}`);
      setPreview(res);
    } catch {
      setError('Failed to load preview');
    }
  }

  async function handleExport(format) {
    setExporting(true);
    setError('');
    try {
      const res = await fetch(`/api/reports/export?from=${range.from}&to=${range.to}&type=${type}&format=${format}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Reports & Exports</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Date From: <input type="date" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} /></label>
        <label style={{ marginLeft: 16 }}>To: <input type="date" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} /></label>
        <label style={{ marginLeft: 16 }}>Type: <select value={type} onChange={e => setType(e.target.value)}>
          <option value="student">Student</option>
          <option value="class">Class</option>
        </select></label>
        <Button onClick={handlePreview} style={{ marginLeft: 16 }}>Preview</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => handleExport('csv')} disabled={exporting}>Export CSV</Button>
        <Button onClick={() => handleExport('pdf')} disabled={exporting} style={{ marginLeft: 8 }}>Export PDF</Button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 24 }}>
        <h3>Preview</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Name</th><th>Sessions</th><th>Score</th></tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr key={i}><td>{row.name}</td><td>{row.sessions}</td><td>{row.score}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
