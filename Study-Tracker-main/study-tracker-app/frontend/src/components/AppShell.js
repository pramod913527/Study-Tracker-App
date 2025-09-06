import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

export function AppShell({ children }) {
  const { role, user, logout } = useAuth();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role || 'student'} />
      <main style={{ flex: 1, padding: 32, background: '#fafbfc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>Welcome, {user ? user.name : 'Guest'}</div>
          {user && <button onClick={logout} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.25rem', cursor: 'pointer' }}>Logout</button>}
        </header>
        {children}
      </main>
    </div>
  );
}
