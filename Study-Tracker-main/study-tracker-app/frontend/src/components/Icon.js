import React from 'react';

export function Icon({ name, size = 20, color = '#222' }) {
  // Simple icon set for demo
  const icons = {
    check: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>,
    close: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>,
    info: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  };
  return icons[name] || null;
}
