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
        if (pr.status === 'fulfilled') setPosts(pr.value.data);
        if (mr.status === 'fulfilled') setMessages(mr.value.data);
        
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
      }}>
        {status}
      </span>
    );
  };

  const thS = { padding: '12px', textAlign: 'left', background: 'var(--snd-bg-color)', color: 'white', border: '1px solid var(--border-clr)' };
  const tdS = { padding: '12px', border: '1px solid var(--border-clr)', verticalAlign: 'top' };

  if (loading) return <div className="content">Loading...</div>;

  return (
    <main className="main-content">
      <div className="content">
        <h2>🛡️ Admin Dashboard</h2>

        {/* Dashboard Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Members', value: users.length, icon: '👥' },
            { label: 'Posts', value: posts.length, icon: '📝' },
            { label: 'Messages', value: messages.length, icon: '✉️' },
          ].map(card => (
            <div key={card.label} style={{ background: 'var(--content-bg)', border: '1px solid var(--border-clr)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{card.value}</div>
              <div style={{ opacity: 0.7, fontSize: '0.8rem' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabBtn('users', 'Members')}
          {tabBtn('posts', 'Posts')}
          {tabBtn('messages', 'Inbox')}
        </div>

        {/* Members Table */}
        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thS}>Name</th>
                  <th style={thS}>Status</th>
                  <th style={thS}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={tdS}>{u.name}<br/><small>{u.email}</small></td>
                    <td style={tdS}>{badge(u.status)}</td>
                    <td style={tdS}>
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleStatus(u._id)} style={{ padding: '4px 8px', borderRadius: '4px' }}>
                          Toggle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Posts Table */}
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
                      <button onClick={() => removePost(p._id)} style={{ color: 'red' }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Messages Inbox */}
        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 ? <p>No messages received.</p> : messages.map(m => (
              <div key={m._id} style={{ background: 'var(--content-bg)', border: '1px solid var(--border-clr)', padding: '15px', borderRadius: '8px', position: 'relative' }}>
                <button 
                  onClick={() => deleteMessage(m._id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  🗑️
                </button>
                <div style={{ marginBottom: '8px' }}>
                  <strong>From: {m.name}</strong> 
                  <span style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '10px' }}>
                    ({new Date(m.createdAt).toLocaleDateString()})
                  </span>
                  <br />
                  <small style={{ color: 'var(--snd-bg-color)' }}>{m.email}</small>
                </div>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '4px', fontStyle: 'italic' }}>
                  "{m.message}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPage;