import React from 'react';
import { colors, typography } from '../styles/tokens';

export function Button({ children, variant = 'primary', ...props }) {
  const style = {
    background: colors[variant],
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '0.5rem 1.25rem',
    fontFamily: typography.fontFamily,
    fontWeight: typography.headingWeight,
    fontSize: 16,
    cursor: 'pointer',
    margin: 4,
  };
  return (
    <button style={style} {...props}>{children}</button>
  );
}
