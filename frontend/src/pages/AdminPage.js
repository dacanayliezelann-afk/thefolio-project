// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]); // New state for inbox
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ur, pr, mr] = await Promise.allSettled([
          API.get('/admin/users'),
          API.get('/admin/posts'),
          API.get('/admin/messages'), // Ensure this endpoint exists in your backend
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

  /* ── Helpers ── */
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
        fontFamily: 'inherit',
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
        display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
        fontSize: '0.78rem', fontWeight: 'bold',
        background: ok ? 'rgba(255,152,0,0.15)' : 'rgba(229,57,53,0.12)',
        color: ok ? 'var(--snd-bg-color)' : '#c62828',
        border: `1px solid ${ok ? 'var(--snd-bg-color)' : '#e53935'}`,
        textTransform: 'capitalize',
      }}>
        {status}
      </span>
    );
  };

  const thS = {
    padding: '10px 12px', textAlign: 'left',
    background: 'var(--snd-bg-color)', color: 'white',
    fontWeight: 'bold', border: '1px solid var(--border-clr)',
    whiteSpace: 'nowrap',
  };
  const tdS = {
    padding: '10px 12px',
    border: '1px solid var(--border-clr)',
    verticalAlign: 'middle',
  };

  if (loading) return (
    <div className="content" style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '40px auto' }} />
      <p>Loading admin data...</p>
    </div>
  );

  return (
    <main className="main-content">
      <div className="content">
        <h2>🛡️ Admin Dashboard</h2>

        {error && (
          <div style={{
            color: '#c62828', background: 'rgba(229,57,53,0.1)',
            border: '1px solid #e53935', borderRadius: '6px',
            padding: '10px 14px', marginBottom: '14px', fontWeight: '600',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabBtn('users', `👥 Members (${users.length})`)}
          {tabBtn('posts', `📝 Posts (${posts.length})`)}
          {tabBtn('messages', `📬 Inbox (${messages.length})`)}
        </div>

        {/* ── Members Tab ── */}
        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thS}>Name</th>
                  <th style={thS}>Email</th>
                  <th style={thS}>Status</th>
                  <th style={thS}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={tdS}><strong>{u.name}</strong></td>
                    <td style={tdS}>{u.email}</td>
                    <td style={tdS}>{badge(u.status)}</td>
                    <td style={tdS}>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => toggleStatus(u._id)}
                          style={{ padding: '5px 10px', background: u.status === 'active' ? '#e53935' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Posts Tab ── */}
        {tab === 'posts' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thS}>Title</th>
                  <th style={thS}>Status</th>
                  <th style={thS}>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id}>
                    <td style={tdS}>{p.title}</td>
                    <td style={tdS}>{badge(p.status)}</td>
                    <td style={tdS}>
                      <button onClick={() => removePost(p._id)} style={{ padding: '5px 10px', background: '#e53935', color: 'white', border: 'none', borderRadius: '4px' }}>🗑️ Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Inbox Tab ── */}
        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 ? (
              <p>No messages in your inbox.</p>
            ) : (
              messages.map(m => (
                <div key={m._id} style={{
                  background: 'var(--content-bg)', border: '1px solid var(--border-clr)',
                  borderRadius: '8px', padding: '16px', position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: 'var(--snd-bg-color)' }}>{m.subject}</h4>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem' }}><strong>From:</strong> {m.name} ({m.email})</p>
                  <p style={{ whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>{m.message}</p>
                  <button 
                    onClick={() => deleteMessage(m._id)}
                    style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '10px' }}
                  >
                    🗑️ Delete Message
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPage;
