import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      setStep('otp');
    } catch (err) {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        onSignup && onSignup(data.token);
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Sign Up</h2>
      {step === 'form' && (
        <form onSubmit={handleSignup}>
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
          <Button type="submit" disabled={loading}>Sign Up</Button>
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <Input label="OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
          <Button type="submit" disabled={loading}>Verify OTP</Button>
        </form>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
