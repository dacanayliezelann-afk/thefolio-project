// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useState, useEffect } from 'react';
import pic2 from '../pictures/pic2.jpg';

function HomePage() {
  const { user } = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(() => setError('Failed to load posts. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main-content">
    <>
        <div style={{ padding: '24px 30px 28px' }}>
          <section className="content">
            <h2 style={{ marginBottom: '10px' }}>Cooking is my Passion 🍳</h2>
              <p>
              Welcome to my portfolio! I believe every meal tells a story —
              from the sizzle of a pan to the vibrant colors of fresh local produce.
              </p>
              <img
                src={pic2}
                alt="Fresh Petchay"
                style={{ width: '100%', borderRadius: '3px', border: 'none' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <h3>Why start cooking?</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
              <li>It provides an escape from everyday pressures.</li>
              <li>It gives you a creative space to be inventive.</li>
              <li>It bridges cultures and brings people together.</li>
              </ul>
              <blockquote>
              "Cooking done with care is an act of love." — Craig Claiborne
              </blockquote>
          </section>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/about">
              <button id="newcolor" style={{ width: 'auto', padding: '12px 28px' }}>
                Read My Story →
              </button>
            </Link>
          </div>
        </div>

      {/* ── Live Posts from Backend ── */}
      <div className="content">
        <h2>Latest Posts</h2>

        {user && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Link to="/create-post">
              <button id="newcolor" style={{ width: 'auto', padding: '10px 24px' }}>
                ✏️ Write a New Post
              </button>
            </Link>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', margin: '0 auto 12px' }} />
            <p>Loading posts...</p>
          </div>
        )}
        {error && (
          <div style={{
            color: '#c62828', background: 'rgba(229,57,53,0.08)',
            border: '1px solid #e53935', borderRadius: '6px',
            padding: '12px 16px', fontWeight: '600',
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '32px 20px',
            border: '2px dashed var(--border-clr)', borderRadius: '8px',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍽️</div>
            <p style={{ fontStyle: 'italic', color: '#8C7E72', margin: 0 }}>
              No posts yet. Be the first to write one!
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(post => (
            <div key={post._id} className="post-card" style={{
              border: '1px solid var(--border-clr)',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'var(--content-bg)',
              padding: 0,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,152,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              {post.image && (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt={post.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 0, border: 'none', margin: 0, display: 'block' }}
                />
              )}
              <div style={{ padding: '18px 20px' }}>
                <h3 style={{ textAlign: 'left', marginBottom: '8px', fontSize: '1.05rem' }}>
                  <Link to={`/posts/${post._id}`} style={{ color: 'var(--text-color)', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ marginBottom: '10px', fontSize: '0.92rem', opacity: 0.85, lineHeight: '1.6' }}>
                  {post.body.substring(0, 150)}…
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: 'var(--snd-bg-color)', fontWeight: '700', fontSize: '0.82rem' }}>
                    By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                  <Link to={`/posts/${post._id}`} style={{
                    color: 'var(--snd-bg-color)', fontWeight: '700', fontSize: '0.88rem',
                    background: 'rgba(255,152,0,0.1)', padding: '4px 12px',
                    borderRadius: '20px', border: '1px solid var(--snd-bg-color)',
                    transition: 'background 0.2s',
                  }}>
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
    </main>
  );
}

export default HomePage;