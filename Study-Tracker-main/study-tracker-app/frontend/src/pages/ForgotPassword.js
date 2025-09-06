import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRequest(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Forgot Password</h2>
      {sent ? (
        <div>Check your email for a reset link.</div>
      ) : (
        <form onSubmit={handleRequest}>
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
          <Button type="submit" disabled={loading}>Send Reset Link</Button>
        </form>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
