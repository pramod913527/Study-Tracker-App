

import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ForgotPassword } from './ForgotPassword';

export function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');
        setStep('otp');
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        setStep('otp');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit');
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
        onLogin && onLogin(data.token);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/logo192.png" alt="Study Tracker Logo" style={{ width: 64, height: 64, marginBottom: 8 }} />
        <h1 style={{ fontWeight: 700, fontSize: 28, margin: 0, color: '#1976d2', letterSpacing: 1 }}>Study Tracker App</h1>
        <div style={{ color: '#888', fontSize: 16, marginTop: 4 }}>Track, Learn, Succeed</div>
      </div>
      <div style={{ maxWidth: 360, width: '100%', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 32px #dbeafe' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Button onClick={() => { setMode('login'); setStep('form'); }} variant={mode === 'login' ? 'primary' : 'default'}>Login</Button>
          <Button onClick={() => { setMode('signup'); setStep('form'); }} variant={mode === 'signup' ? 'primary' : 'default'} style={{ marginLeft: 8 }}>Sign Up</Button>
        </div>
        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />}
            <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
            <Input label="Password" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
            <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 12 }}>{mode === 'login' ? 'Login' : 'Sign Up'}</Button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <Input label="OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
            <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: 12 }}>Verify OTP</Button>
          </form>
        )}
        {mode === 'login' && step === 'form' && (
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: 14 }} onClick={() => setShowForgot(true)}>
              Forgot password?
            </button>
          </div>
        )}
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </div>
      {showForgot && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, boxShadow: '0 2px 16px #eee', minWidth: 320 }}>
            <ForgotPassword />
            <Button onClick={() => setShowForgot(false)} style={{ width: '100%', marginTop: 8 }}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
