import React from 'react';
import { Table } from './Table';

export default {
  title: 'Design System/Table',
  component: Table,
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
];
const data = [
  { name: 'Alice', age: 22 },
  { name: 'Bob', age: 28 },
];

export const Basic = () => <Table columns={columns} data={data} />;
