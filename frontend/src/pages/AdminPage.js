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

  /* ── Stats Calculations ── */
  const activeUsers = users.filter(u => u.status === 'active').length;
  const deactivatedUsers = users.filter(u => u.status !== 'active' && u.role !== 'admin').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;

  /* ── Styles ── */
  const thS = { padding: '12px', textAlign: 'left', background: 'var(--snd-bg-color)', color: 'white', border: '1px solid var(--border-clr)' };
  const tdS = { padding: '12px', border: '1px solid var(--border-clr)', verticalAlign: 'middle' };

  if (loading) return <div className="content">Loading Admin Panel...</div>;

  return (
    <main className="main-content">
      <div className="content">
        <h2>🛡️ Admin Dashboard</h2>

        {/* Updated Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'Total Members', value: users.length, icon: '👥', color: 'var(--text-color)' },
            { label: 'Active', value: activeUsers, icon: '✅', color: '#2e7d32' },
            { label: 'Deactivated', value: deactivatedUsers, icon: '🚫', color: '#e53935' },
            { label: 'Live Posts', value: publishedPosts, icon: '📝', color: 'var(--snd-bg-color)' },
            { label: 'Inbox', value: messages.length, icon: '✉️', color: '#1976d2' },
          ].map(card => (
            <div key={card.label} style={{ background: 'var(--content-bg)', border: '1px solid var(--border-clr)', borderRadius: '10px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{card.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: card.color }}>{card.value}</div>
              <div style={{ opacity: 0.7, fontSize: '0.85rem', fontWeight: '600' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <button onClick={() => setTab('users')} className={`btn ${tab === 'users' ? '' : 'btn-outline'}`}>Members</button>
          <button onClick={() => setTab('posts')} className={`btn ${tab === 'posts' ? '' : 'btn-outline'}`}>Posts</button>
          <button onClick={() => setTab('messages')} className={`btn ${tab === 'messages' ? '' : 'btn-outline'}`}>Inbox ({messages.length})</button>
        </div>

        {/* Content Area */}
        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thS}>Member Details</th>
                  <th style={thS}>Status</th>
                  <th style={thS}>Account Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={tdS}>
                      <strong>{u.name}</strong><br />
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{u.email}</span>
                    </td>
                    <td style={tdS}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                        background: u.status === 'active' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(229, 57, 53, 0.1)',
                        color: u.status === 'active' ? '#2e7d32' : '#e53935'
                      }}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdS}>
                      {u.role !== 'admin' ? (
                        <button 
                          onClick={() => toggleStatus(u._id)}
                          style={{ 
                            padding: '6px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold',
                            background: u.status === 'active' ? '#e53935' : '#2e7d32'
                          }}
                        >
                          {u.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                      ) : <small>System Admin</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'posts' && (
           <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thS}>Post Title</th>
                    <th style={thS}>Author</th>
                    <th style={thS}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id}>
                      <td style={tdS}>{p.title}</td>
                      <td style={tdS}>{p.author?.name || 'Unknown'}</td>
                      <td style={tdS}>
                        <button onClick={() => removePost(p._id)} style={{ color: '#e53935', background: 'none', border: '1px solid #e53935', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}

        {tab === 'messages' && (
          <div style={{ display: 'grid', gap: '15px' }}>
            {messages.length === 0 ? <p>No messages in your inbox.</p> : messages.map(m => (
              <div key={m._id} style={{ background: 'var(--content-bg)', border: '1px solid var(--border-clr)', padding: '20px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <strong>{m.name}</strong> <small style={{ opacity: 0.6 }}>({m.email})</small>
                  </div>
                  <button onClick={() => deleteMessage(m._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                </div>
                <p style={{ fontStyle: 'italic', margin: 0 }}>"{m.message}"</p>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', opacity: 0.5, marginTop: '10px' }}>
                  {new Date(m.createdAt).toLocaleString()}
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