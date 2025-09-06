import React from 'react';

export function OfflineBanner({ syncing, queued }) {
  return (
    <div style={{ background: '#ffecb3', color: '#a67c00', padding: 8, textAlign: 'center', fontWeight: 500 }} aria-live="polite">
      {navigator.onLine ?
        (syncing ? 'Syncing...' : (queued > 0 ? `${queued} actions queued for sync` : 'Online')) :
        'You are offline. Actions will be queued.'}
    </div>
  );
}
