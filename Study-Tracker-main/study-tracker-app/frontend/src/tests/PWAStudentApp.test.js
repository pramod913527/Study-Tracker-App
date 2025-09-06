import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { PWAStudentApp } from '../pages/PWAStudentApp';

describe('PWAStudentApp', () => {
  it('renders and allows session start/complete', () => {
    render(<PWAStudentApp />);
    expect(screen.getByText(/Student PWA/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Start Session/i));
    expect(screen.getByText(/Session started/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Complete Session/i));
    expect(screen.getByText(/Session completed/i)).toBeInTheDocument();
  });
});
