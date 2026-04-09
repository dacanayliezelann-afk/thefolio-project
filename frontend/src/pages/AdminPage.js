import { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ur, pr, mr] = await Promise.allSettled([
          API.get('/admin/users'),
          API.get('/admin/posts'),
          API.get('/admin/messages'),
        ]);

        if (ur.status === 'fulfilled') setUsers(ur.value.data);
        else setError('Could not load users.');

        if (pr.status === 'fulfilled') setPosts(pr.value.data);
        else setError(prev => prev + ' Could not load posts.');

        if (mr.status === 'fulfilled') setMessages(mr.value.data);
        else setError(prev => prev + ' Could not load messages.');
        
      } catch (err) {
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
    } catch {
      alert('Failed to update user status.');
    }
  };

  const removePost = async (id) => {
    if (!window.confirm('Mark this post as removed?')) return;
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(prev => prev.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch {
      alert('Failed to remove post.');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message forever?')) return;
    try {
      await API.delete(`/admin/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch {
      alert('Failed to delete message.');
    }
  };

  /* ── Styles & Helpers ── */
  const tabBtn = (val, label) => (
    <button
      onClick={() => setTab(val)}
      style={{
        padding: '10px 22px',
        background: tab === val ? 'var(--snd-bg-color)' : 'transparent',
        color: tab === val ? 'white' : 'var(--snd-bg-color)',
        border: '2px solid var(--snd-bg-color)',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.92rem',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );

  const badge = (status) => {
    const ok = status === 'active' || status === 'published';
    return (
      <span style={{
        padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold',
        background: ok ? 'rgba(255,152,0,0.15)' : 'rgba(229,57,53,0.12)',
        color: ok ? 'var(--snd-bg-color)' : '#c62828',
        border: `1px solid ${ok ? 'var(--snd-bg-color)' : '#e53935'}`,
        textTransform: 'capitalize',
      }}>
        {status}
      </span>
    );
  };

  const thS = { padding: '12px', textAlign: 'left', background: 'var(--snd-bg-color)', color: 'white' };
  const tdS = { padding: '12px', border: '1px solid var(--border-clr)' };

  if (loading) return <div className="content"><p>Loading admin dashboard...</p></div>;

  return (
    <main className="main-content">
      <div className="content">
        <h2>🛡️ Admin Dashboard</h2>
        {error && <div style={{ color: 'red', padding: '10px', background: '#ffeeee' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {tabBtn('users', `Users (${users.length})`)}
          {tabBtn('posts', `Posts (${posts.length})`)}
          {tabBtn('messages', `Inbox (${messages.length})`)}
        </div>

        {tab === 'users' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={thS}>Name</th><th style={thS}>Status</th><th style={thS}>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={tdS}>{u.name}</td>
                  <td style={tdS}>{badge(u.status)}</td>
                  <td style={tdS}>
                    <button onClick={() => toggleStatus(u._id)}>Toggle Status</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 ? <p>No messages.</p> : messages.map(m => (
              <div key={m._id} style={{ border: '1px solid var(--border-clr)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{m.subject}</strong>
                  <small>{new Date(m.createdAt).toLocaleDateString()}</small>
                </div>
                <p style={{ fontSize: '0.85rem' }}>From: {m.name} ({m.email})</p>
                <p style={{ background: '#f9f9f9', padding: '10px' }}>{m.message}</p>
                <button onClick={() => deleteMessage(m._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPage;
