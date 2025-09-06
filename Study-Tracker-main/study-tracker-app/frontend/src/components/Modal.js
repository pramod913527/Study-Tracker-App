import React from 'react';
import { colors, typography } from '../styles/tokens';

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: colors.surface,
        borderRadius: 8,
        padding: 24,
        minWidth: 320,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
        fontFamily: typography.fontFamily,
      }}>
        <div style={{ fontWeight: typography.headingWeight, fontSize: 18, marginBottom: 12 }}>{title}</div>
        <div>{children}</div>
        <button onClick={onClose} style={{ marginTop: 16, background: colors.primary, color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.25rem', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}
