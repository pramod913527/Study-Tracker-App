import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { OfflineBanner } from '../components/OfflineBanner';
import { QueuedActionsList } from '../components/QueuedActionsList';
import { t, setLang } from '../i18n';

// Simple offline queue using localStorage
function getQueue() {
  return JSON.parse(localStorage.getItem('offlineQueue') || '[]');
}
function setQueue(q) {
  localStorage.setItem('offlineQueue', JSON.stringify(q));
}

export function PWAStudentApp() {
  const [sessionActive, setSessionActive] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [queue, setQueueState] = useState(getQueue());
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    function handleOnline() { setOffline(false); syncQueue(); }
    function handleOffline() { setOffline(true); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function startSession() {
    setSessionActive(true);
    setStatus('Session started');
  }
  function completeSession() {
    setSessionActive(false);
    queueAction({ type: 'completeSession', timestamp: Date.now() });
    setStatus('Session completed (queued if offline)');
  }
  function queueAction(action) {
    const newQueue = [...getQueue(), action];
    setQueue(newQueue);
    setQueueState(newQueue);
  }
  async function syncQueue() {
    setSyncing(true);
    let q = getQueue();
    for (let i = 0; i < q.length; i++) {
      try {
        await fetch('/api/sessions/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(q[i]),
        });
        q = getQueue();
        q.shift();
        setQueue(q);
        setQueueState(q);
      } catch {
        setStatus('Sync failed, will retry');
        break;
      }
    }
    setSyncing(false);
    setStatus(q.length === 0 ? 'All actions synced' : 'Some actions pending');
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }} aria-label="Student PWA" tabIndex={0}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 id="student-pwa-title">{t('Student PWA')}</h2>
        <label htmlFor="lang-select" style={{ marginLeft: 8 }}>🌐</label>
        <select id="lang-select" aria-label="Language" onChange={e => setLang(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
      <OfflineBanner syncing={syncing} queued={queue.length} />
      <div style={{ marginBottom: 16 }}>
        <Button onClick={startSession} disabled={sessionActive} aria-label={t('Start Session')}>{t('Start Session')}</Button>
        <Button onClick={completeSession} disabled={!sessionActive} aria-label={t('Complete Session')}>{t('Complete Session')}</Button>
      </div>
      <div>{t('Queued actions')}: {queue.length}</div>
      <div style={{ marginTop: 8 }} aria-live="polite">{t(status)}</div>
      <Button onClick={syncQueue} disabled={syncing || queue.length === 0} style={{ marginTop: 12 }} aria-label={t('Sync Now')}>{t('Sync Now')}</Button>
      <QueuedActionsList queue={queue} />
    </div>
  );
}
