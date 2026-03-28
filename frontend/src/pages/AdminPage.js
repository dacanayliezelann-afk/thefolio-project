// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminPage() {
  const [users,   setUsers]   = useState([]);
  const [posts,   setPosts]   = useState([]);
  const [tab,     setTab]     = useState('users');
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ur, pr] = await Promise.allSettled([
          API.get('/admin/users'),
          API.get('/admin/posts'),
        ]);
        if (ur.status === 'fulfilled') setUsers(ur.value.data);
        else setError('Could not load users.');
        if (pr.status === 'fulfilled') setPosts(pr.value.data);
        else setError(prev => prev + ' Could not load posts.');
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
    if (!window.confirm('Mark this post as removed? This cannot be undone.')) return;
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(prev => prev.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch {
      alert('Failed to remove post.');
    }
  };

  /* ── Helpers ── */
  const tabBtn = (val, label) => (
    <button
      onClick={() => setTab(val)}
      style={{
        padding:      '10px 22px',
        background:   tab === val ? 'var(--snd-bg-color)' : 'transparent',
        color:        tab === val ? 'white' : 'var(--snd-bg-color)',
        border:       '2px solid var(--snd-bg-color)',
        borderRadius: '6px',
        fontWeight:   'bold',
        cursor:       'pointer',
        fontSize:     '0.92rem',
        fontFamily:   'inherit',
        transition:   'all 0.2s',
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
        color:      ok ? 'var(--snd-bg-color)' : '#c62828',
        border:     `1px solid ${ok ? 'var(--snd-bg-color)' : '#e53935'}`,
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

  /* ── Stats ── */
  const activeUsers   = users.filter(u => u.status === 'active').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;

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

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Members',   value: users.length,   icon: '👥' },
          { label: 'Active Members',  value: activeUsers,    icon: '✅' },
          { label: 'Total Posts',     value: posts.length,   icon: '📝' },
          { label: 'Published Posts', value: publishedPosts, icon: '🟢' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'var(--content-bg)', border: '1px solid var(--border-clr)',
            borderRadius: '8px', padding: '16px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{card.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--snd-bg-color)' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-color)', opacity: 0.7 }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {tabBtn('users', `👥 Members (${users.length})`)}
        {tabBtn('posts', `📝 All Posts (${posts.length})`)}
      </div>

      {/* ── Members Tab ── */}
      {tab === 'users' && (
        <>
          <h3 style={{ textAlign: 'left' }}>Member Accounts</h3>
          {users.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#8C7E72' }}>No members registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thS}>Name</th>
                    <th style={thS}>Email</th>
                    <th style={thS}>Role</th>
                    <th style={thS}>Status</th>
                    <th style={thS}>Joined</th>
                    <th style={thS}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={tdS}>
                        <strong>{u.name}</strong>
                      </td>
                      <td style={tdS}>{u.email}</td>
                      <td style={tdS}>
                        <span style={{
                          fontWeight: 'bold', textTransform: 'capitalize',
                          color: u.role === 'admin' ? 'var(--snd-bg-color)' : 'inherit',
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={tdS}>{badge(u.status)}</td>
                      <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={tdS}>
                        {u.role !== 'admin' ? (
                          <button
                            onClick={() => toggleStatus(u._id)}
                            style={{
                              padding: '5px 14px', border: 'none', borderRadius: '5px',
                              fontWeight: 'bold', cursor: 'pointer',
                              background: u.status === 'active' ? '#e53935' : 'var(--snd-bg-color)',
                              color: 'white', fontSize: '0.82rem', fontFamily: 'inherit',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        ) : (
                          <span style={{ color: '#8C7E72', fontSize: '0.85rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Posts Tab ── */}
      {tab === 'posts' && (
        <>
          <h3 style={{ textAlign: 'left' }}>All Posts</h3>
          {posts.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#8C7E72' }}>No posts yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thS}>Title</th>
                    <th style={thS}>Author</th>
                    <th style={thS}>Status</th>
                    <th style={thS}>Date</th>
                    <th style={thS}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id}>
                      <td style={tdS}>
                        <a
                          href={`/posts/${p._id}`}
                          style={{ color: 'var(--text-color)', fontWeight: '600', textDecoration: 'none' }}
                        >
                          {p.title}
                        </a>
                      </td>
                      <td style={tdS}>{p.author?.name || '—'}</td>
                      <td style={tdS}>{badge(p.status)}</td>
                      <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td style={tdS}>
                        {p.status === 'published' ? (
                          <button
                            onClick={() => removePost(p._id)}
                            style={{
                              padding: '5px 14px', border: 'none', borderRadius: '5px',
                              fontWeight: 'bold', cursor: 'pointer',
                              background: '#e53935', color: 'white',
                              fontSize: '0.82rem', fontFamily: 'inherit',
                            }}
                          >
                            🗑️ Remove
                          </button>
                        ) : (
                          <span style={{ color: '#8C7E72', fontSize: '0.85rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
    </main>
  );
}

export default AdminPage;