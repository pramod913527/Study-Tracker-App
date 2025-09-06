import React from 'react';

export function QueuedActionsList({ queue }) {
  if (!queue.length) return null;
  return (
    <div style={{ marginTop: 16, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4, padding: 12 }}>
      <b>Queued Actions:</b>
      <ul>
        {queue.map((a, i) => <li key={i}>{a.type} at {new Date(a.timestamp).toLocaleString()}</li>)}
      </ul>
    </div>
  );
}
