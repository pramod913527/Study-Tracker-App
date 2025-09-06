import React from 'react';
import { Select } from './Select';

export default {
  title: 'Design System/Select',
  component: Select,
};

const options = [
  { value: '', label: 'Select an option' },
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];

export const Basic = () => <Select label="Options" options={options} />;
