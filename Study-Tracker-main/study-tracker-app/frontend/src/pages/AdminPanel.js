import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { connectSocket } from '../utils/socket';

export function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [adminUpdates, setAdminUpdates] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/admin/users');
      setUsers(await res.json());
      const logs = await fetch('/api/admin/audit');
      setAuditLogs(await logs.json());
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const socket = connectSocket(token);
    socket.on('adminUpdate', update => setAdminUpdates(prev => [update, ...prev]));
    return () => { socket.off('adminUpdate'); };
  }, []);

  function openModal(user) {
    setSelectedUser(user);
    setRole(user.role);
    setModalOpen(true);
  }

  async function handleGrantRevoke() {
    await fetch('/api/admin/role', { method: 'POST', body: JSON.stringify({ userId: selectedUser.id, role }) });
    setModalOpen(false);
  }

  async function handleInvite() {
    await fetch('/api/admin/invite', { method: 'POST', body: JSON.stringify({ email: inviteEmail }) });
    setInviteEmail('');
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px #eee' }}>
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: 24 }}>
        <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Invite user by email" />
        <Button onClick={handleInvite}>Invite</Button>
      </div>
      <h3>Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><Button onClick={() => openModal(u)}>Grant/Revoke Role</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Grant/Revoke Role">
        <div>
          <label>Role: <input value={role} onChange={e => setRole(e.target.value)} /></label>
        </div>
        <Button onClick={handleGrantRevoke} style={{ marginTop: 16 }}>Save</Button>
      </Modal>
      <h3 style={{ marginTop: 32 }}>Audit Logs</h3>
      <ul>
        {auditLogs.map(log => (
          <li key={log.id}>{log.action} by {log.user} at {log.time}</li>
        ))}
      </ul>
      <h3 style={{ marginTop: 32 }}>Admin Updates</h3>
      <ul>
        {adminUpdates.map((update, index) => (
          <li key={index}>{JSON.stringify(update)}</li>
        ))}
      </ul>
    </div>
  );
}
