import React from 'react';

const navs = {
  student: [
    { label: 'Home', path: '/student' },
    { label: 'Timetable', path: '/student/timetable' },
    { label: 'History', path: '/student/history' },
  ],
  guardian: [
    { label: 'Dashboard', path: '/guardian' },
    { label: 'Notifications', path: '/guardian/notifications' },
  ],
  mentor: [
    { label: 'Class', path: '/mentor' },
    { label: 'Analytics', path: '/mentor/analytics' },
  ],
  admin: [
    { label: 'Users', path: '/admin/users' },
    { label: 'Audit Logs', path: '/admin/audit' },
  ],
};

export function Sidebar({ role, setPage }) {
  return (
    <aside style={{ width: 200, background: '#f5f5f5', padding: 16, minHeight: '100vh' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(navs[role] || []).map(item => (
            <li key={item.path} style={{ margin: '16px 0' }}>
              <a href={item.path} style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>{item.label}</a>
            </li>
          ))}
          {role === 'admin' && (
            <>
              <li style={{ margin: '16px 0' }}>
                <button onClick={() => setPage('reports')} style={{ color: '#1976d2', background: 'none', border: 'none', padding: 0, fontWeight: 500, cursor: 'pointer' }}>
                  Reports & Exports
                </button>
              </li>
              <li style={{ margin: '16px 0' }}>
                <button onClick={() => setPage('notifications')} style={{ color: '#1976d2', background: 'none', border: 'none', padding: 0, fontWeight: 500, cursor: 'pointer' }}>
                  Notification Templates
                </button>
              </li>
              <li style={{ margin: '16px 0' }}>
                <button onClick={() => setPage('onboarding')} style={{ color: '#1976d2', background: 'none', border: 'none', padding: 0, fontWeight: 500, cursor: 'pointer' }}>
                  Onboarding
                </button>
              </li>
            </>
          )}
          {role === 'student' && (
            <li style={{ margin: '16px 0' }}>
              <button onClick={() => setPage('pwa')} style={{ color: '#1976d2', background: 'none', border: 'none', padding: 0, fontWeight: 500, cursor: 'pointer' }}>
                Student PWA
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
