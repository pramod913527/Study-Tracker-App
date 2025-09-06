import React from 'react';
import { typography } from '../styles/tokens';

export function Table({ columns, data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: typography.fontFamily, fontSize: 15 }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={{ borderBottom: '2px solid #eee', textAlign: 'left', padding: 8 }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={col.key} style={{ borderBottom: '1px solid #eee', padding: 8 }}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
