import React from 'react';
import { typography } from '../styles/tokens';

export function Select({ label, options, ...props }) {
  return (
    <label style={{ display: 'block', marginBottom: 8 }}>
      <span style={{ fontFamily: typography.fontFamily, fontWeight: typography.headingWeight, fontSize: 14 }}>
        {label}
      </span>
      <select style={{
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: 4,
        fontFamily: typography.fontFamily,
        fontSize: 16,
        marginTop: 4,
      }} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
