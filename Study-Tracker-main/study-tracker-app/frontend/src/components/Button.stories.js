import React from 'react';
import { Button } from './Button';

export default {
  title: 'Design System/Button',
  component: Button,
};

export const Primary = () => <Button>Primary Button</Button>;
export const Secondary = () => <Button variant="secondary">Secondary Button</Button>;
export const Success = () => <Button variant="success">Success Button</Button>;
export const Warning = () => <Button variant="warning">Warning Button</Button>;
export const Error = () => <Button variant="error">Error Button</Button>;
