// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

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
    <main className="main-content" style={{ background: '#fffbf0', minHeight: '100vh', paddingTop: '40px' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #ff9800 0%, #ff6f00 60%, #e65100 100%)',
        padding: '56px 24px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        maxWidth: '860px',
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(255,152,0,0.20)',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <p style={{ fontSize: '3rem', marginBottom: '8px', lineHeight: 1 }}>🍳</p>
        <h1 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          All About Cooking
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '520px', margin: '0 auto 28px', fontSize: '1.05rem', lineHeight: '1.7' }}>
          Every meal tells a story — from the sizzle of a pan to the vibrant colors of fresh local produce.
          Explore recipes, share your kitchen adventures, and connect with fellow food lovers.
        </p>

        {user ? (
          <Link to="/create-post" style={{
            display: 'inline-block', padding: '13px 32px',
            background: '#fff', color: '#e65100',
            borderRadius: '999px', textDecoration: 'none',
            fontWeight: '800', fontSize: '1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)'; }}
          >
            ✏️ Write a Post
          </Link>
        ) : (
          <Link to="/register" style={{
            display: 'inline-block', padding: '13px 32px',
            background: '#fff', color: '#e65100',
            borderRadius: '999px', textDecoration: 'none',
            fontWeight: '800', fontSize: '1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}>
            🍽️ Join the Community
          </Link>
        )}
      </div>

      {/* ── Why Cooking section ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: '#bf360c', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>Why Cooking?</h2>
          <p style={{ color: '#8d6e63', fontSize: '0.95rem' }}>A few reasons to tie on your apron today</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: '🧠', title: 'Sparks Creativity',    desc: 'A recipe is just a starting point. Swapping ingredients and inventing new flavors makes cooking endlessly inventive.' },
            { icon: '🤝', title: 'Brings People Together', desc: 'The dinner table is where friendships deepen and families reconnect over shared plates and laughter.' },
            { icon: '💪', title: 'Builds Confidence',     desc: 'Mastering a new dish gives you a quiet pride — and each success makes the next challenge feel achievable.' },
            { icon: '🌍', title: 'Explores Cultures',     desc: 'Cooking a foreign recipe is like travelling without a plane ticket. Every spice tells a story of its homeland.' },
            { icon: '🥗', title: 'Promotes Health',       desc: 'Home-cooked meals let you control every ingredient, making it easy to eat nourishing, wholesome food.' },
            { icon: '✨', title: 'Pure Joy',               desc: "There's something deeply satisfying about feeding people you love. Cooking is one of the kindest acts you can do." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: '#fff',
              border: '1.5px solid #ffe0b2',
              borderRadius: '14px',
              padding: '22px 18px',
              boxShadow: '0 2px 8px rgba(255,152,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,152,0,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,152,0,0.08)'; }}
            >
              <p style={{ fontSize: '2rem', marginBottom: '10px' }}>{icon}</p>
              <h3 style={{ fontSize: '1rem', color: '#bf360c', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{title}</h3>
              <p style={{ color: '#795548', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{
          borderLeft: '5px solid #ff9800',
          background: 'linear-gradient(90deg, #fff8e1, #fff)',
          borderRadius: '0 12px 12px 0',
          padding: '20px 28px',
          marginBottom: '48px',
          boxShadow: '0 2px 12px rgba(255,152,0,0.10)',
        }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontStyle: 'italic', color: '#4e342e', lineHeight: '1.8', margin: '0 0 10px' }}>
            "Cooking done with care is an act of love."
          </p>
          <footer style={{ fontSize: '0.88rem', color: '#ff6f00', fontWeight: '700' }}>— Craig Claiborne</footer>
        </div>
      </div>

      {/* ── Latest Posts ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#bf360c', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>📝 Latest Posts</h2>
            <p style={{ color: '#8d6e63', fontSize: '0.88rem', margin: 0 }}>Fresh from the community kitchen</p>
          </div>
          {user && (
            <Link to="/create-post" style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #ff9800, #e65100)',
              color: '#fff', borderRadius: '999px',
              textDecoration: 'none', fontWeight: '700',
              fontSize: '0.9rem', boxShadow: '0 3px 10px rgba(255,152,0,0.35)',
            }}>
              ✏️ Write a Post
            </Link>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff9800' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
            <p style={{ color: '#8d6e63', fontStyle: 'italic' }}>Loading posts…</p>
          </div>
        )}

        {error && (
          <div style={{ color: '#c62828', background: 'rgba(229,57,53,0.08)', border: '1px solid #e53935', borderRadius: '10px', padding: '14px 18px', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', border: '2px dashed #ffcc80', borderRadius: '14px', background: '#fff8e1' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽️</div>
            <p style={{ color: '#8d6e63', fontStyle: 'italic', margin: 0 }}>No posts yet — be the first to write one!</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {posts.map(post => (
            <Link key={post._id} to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{
                border: '1.5px solid #ffe0b2',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(255,152,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', flexDirection: 'column', height: '100%',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,152,0,0.20)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,152,0,0.08)'; }}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '100%', height: '190px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '110px',
                    background: 'linear-gradient(135deg, #ff9800, #e65100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
                  }}>🍳</div>
                )}

                <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px', fontSize: '1.05rem', color: '#4e342e',
                    fontFamily: 'Georgia, serif', lineHeight: '1.4',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    margin: '0 0 14px', color: '#795548', fontSize: '0.88rem', lineHeight: '1.6', flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {post.body}
                  </p>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: '1px solid #ffe0b2', paddingTop: '12px',
                    fontSize: '0.82rem',
                  }}>
                    <span style={{ color: '#e65100', fontWeight: '700' }}>
                      ✍️ {post.author?.name || 'Unknown'}
                    </span>
                    <span style={{
                      color: '#e65100', fontWeight: '700',
                      background: '#fff8e1', padding: '3px 12px',
                      borderRadius: '999px', border: '1px solid #ffcc80',
                    }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}

export default HomePage;