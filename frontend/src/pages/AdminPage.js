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

  /* ── Calculations ── */
  const activeUsers = users.filter(u => u.status === 'active').length;
  const deactivatedUsers = users.filter(u => u.status !== 'active' && u.role !== 'admin').length;

  /* ── Handlers ── */
  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
    } catch { alert('Error updating status'); }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete message?')) return;
    try {
      await API.delete(`/admin/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch { alert('Error deleting message'); }
  };

  if (loading) return <div className="content" style={{textAlign:'center', padding:'50px'}}>Loading...</div>;

  /* ── Styles ── */
  const cardStyle = {
    background: 'var(--content-bg)',
    border: '1px solid var(--border-clr)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default'
  };

  const navContainerStyle = {
    display: 'flex',
    background: 'rgba(0,0,0,0.05)',
    padding: '5px',
    borderRadius: '10px',
    marginBottom: '30px',
    width: 'fit-content',
    border: '1px solid var(--border-clr)'
  };

  const navButtonStyle = (active) => ({
    padding: '10px 25px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    background: active ? 'var(--snd-bg-color)' : 'transparent',
    color: active ? 'white' : 'var(--text-color)',
    boxShadow: active ? '0 4px 10px rgba(0,0,0,0.15)' : 'none',
  });

  return (
    <main className="main-content">
      <div className="content">
        <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem', background: 'var(--snd-bg-color)', color: 'white', padding: '5px 10px', borderRadius: '8px' }}>Admin</span> 
          Dashboard Overview
        </h2>

        {/* Improved Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Members', value: users.length, icon: '👥', color: 'var(--text-color)' },
            { label: 'Active', value: activeUsers, icon: '🟢', color: '#2e7d32' },
            { label: 'Deactivated', value: deactivatedUsers, icon: '🚫', color: '#e53935' },
            { label: 'Inbox', value: messages.length, icon: '✉️', color: '#1976d2' },
          ].map(card => (
            <div key={card.label} style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: card.color }}>{card.value}</div>
              <div style={{ opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Improved Segmented Navigation Buttons */}
        <div style={navContainerStyle}>
          <button onClick={() => setTab('users')} style={navButtonStyle(tab === 'users')}>Members</button>
          <button onClick={() => setTab('posts')} style={navButtonStyle(tab === 'posts')}>Posts</button>
          <button onClick={() => setTab('messages')} style={navButtonStyle(tab === 'messages')}>Inbox ({messages.length})</button>
        </div>

        {/* Table / List Content */}
        <div style={{ background: 'var(--content-bg)', border: '1px solid var(--border-clr)', borderRadius: '12px', padding: '20px', minHeight: '300px' }}>
          {tab === 'users' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-clr)' }}>
                  <th style={{ textAlign: 'left', padding: '15px' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '15px' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '15px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-clr)' }}>
                    <td style={{ padding: '15px' }}>
                      <strong>{u.name}</strong><br/><small style={{opacity:0.6}}>{u.email}</small>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800',
                        background: u.status === 'active' ? 'rgba(46,125,50,0.1)' : 'rgba(229,57,53,0.1)',
                        color: u.status === 'active' ? '#2e7d32' : '#e53935',
                        border: `1px solid ${u.status === 'active' ? '#2e7d32' : '#e53935'}`
                      }}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => toggleStatus(u._id)}
                          style={{ 
                            padding: '8px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold', fontSize: '0.8rem',
                            background: u.status === 'active' ? '#e53935' : '#2e7d32'
                          }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'messages' && (
            <div style={{ display: 'grid', gap: '15px' }}>
              {messages.length === 0 ? <p style={{opacity:0.5, textAlign:'center', padding:'40px'}}>Inbox is empty.</p> : messages.map(m => (
                <div key={m._id} style={{ border: '1px solid var(--border-clr)', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{m.name} <span style={{fontWeight:'normal', opacity:0.5, marginLeft:'10px'}}>{m.email}</span></strong>
                    <button onClick={() => deleteMessage(m._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️</button>
                  </div>
                  <p style={{ margin: 0, padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px' }}>{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminPage;