import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

export function Onboarding() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('student');
  const [consent, setConsent] = useState(false);
  const [accepted, setAccepted] = useState(false);

  function handleInvite() {
    setInviteOpen(true);
  }

  async function handleAccept() {
    // Accept invite, assign role, collect consent
    await fetch('/api/onboarding/accept', { method: 'POST', body: JSON.stringify({ email: inviteEmail, role, consent }) });
    setAccepted(true);
    setInviteOpen(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Onboarding</h2>
      <Button onClick={handleInvite}>Accept Invite</Button>
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Accept Invitation">
        <div>
          <label>Email: <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} /></label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Role: <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="guardian">Guardian</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select></label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> I consent to data use</label>
        </div>
        <Button onClick={handleAccept} style={{ marginTop: 12 }}>Accept</Button>
      </Modal>
      {accepted && <div style={{ color: 'green', marginTop: 16 }}>Invite accepted and role assigned!</div>}
    </div>
  );
}
