import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Login } from '../pages/Login';

describe('Login', () => {
  it('renders and allows login', () => {
    render(<Login />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Login/i));
  });
});
