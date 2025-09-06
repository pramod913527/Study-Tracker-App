import React from 'react';
import { render, screen } from '@testing-library/react';
import { GuardianDashboard } from '../pages/GuardianDashboard';

describe('GuardianDashboard', () => {
  it('renders notifications', () => {
    render(<GuardianDashboard />);
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });
});
