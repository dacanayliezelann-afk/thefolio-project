// frontend/src/pages/PostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post,       setPost]       = useState(null);
  const [comments,   setComments]   = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    Promise.all([
      API.get(`/posts/${id}`),
      API.get(`/comments/${id}`),
    ])
      .then(([postRes, commentRes]) => {
        setPost(postRes.data);
        setComments(commentRes.data);
      })
      .catch(() => setError('Post not found or server error.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch {
      alert('Failed to delete post.');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { body: newComment });
      setComments(prev => [...prev, data]);
      setNewComment('');
    } catch {
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {
      alert('Failed to delete comment.');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#ff9800' }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
      <p style={{ color: '#8d6e63' }}>Loading post…</p>
    </div>
  );
  if (error) return (
    <div style={{ maxWidth: '720px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ color: '#c62828', fontWeight: '600' }}>{error}</p>
      <Link to="/home" style={{ color: '#ff9800', fontWeight: '700' }}>← Back to Home</Link>
    </div>
  );

  const isOwner = user && post.author?._id === user._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ background: '#fffbf0', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Cover image */}
      {post.image && (
        <div style={{ width: '100%', maxHeight: '380px', overflow: 'hidden' }}>
          {/* ✅ FIX: post.image is base64 — use directly, no API_ORIGIN prefix needed */}
          <img
            src={post.image}
            alt={post.title}
            style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '36px 24px 0' }}>

        {/* Title + meta */}
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#4e342e', marginBottom: '8px', fontSize: 'clamp(1.5rem,4vw,2.2rem)' }}>
          {post.title}
        </h2>
        <p style={{ color: '#e65100', fontSize: '0.9rem', fontWeight: '700', marginBottom: '20px' }}>
          By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {/* Owner / Admin action bar */}
        {(isOwner || isAdmin) && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
            padding: '14px 18px', borderRadius: '12px', marginBottom: '28px',
            background: '#fff8e1', border: '1.5px solid #ffcc80',
            boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
          }}>
            <span style={{ fontSize: '0.82rem', color: '#8d6e63', marginRight: 'auto' }}>
              {isAdmin && !isOwner ? '🛡️ Admin controls' : '✍️ Your post'}
            </span>
            {isOwner && (
              <Link to={`/edit-post/${post._id}`} style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #ff9800, #e65100)',
                color: '#fff', borderRadius: '999px',
                textDecoration: 'none', fontWeight: '700', fontSize: '0.88rem',
                boxShadow: '0 2px 8px rgba(255,152,0,0.30)',
              }}>
                ✏️ Edit
              </Link>
            )}
            <button onClick={() => setShowConfirm(true)} style={{
              padding: '8px 20px', background: 'transparent',
              color: '#c62828', border: '1.5px solid #c62828',
              borderRadius: '999px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c62828'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c62828'; }}
            >
              🗑️ Delete
            </button>
          </div>
        )}

        {/* Delete confirmation modal */}
        {showConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '36px 28px', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.20)' }}>
              <p style={{ fontSize: '2.2rem', marginBottom: '10px' }}>🗑️</p>
              <h3 style={{ fontFamily: 'Georgia, serif', color: '#4e342e', marginBottom: '10px' }}>Delete this post?</h3>
              <p style={{ color: '#8d6e63', fontSize: '0.92rem', marginBottom: '24px' }}>
                This cannot be undone. The post will be permanently removed.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setShowConfirm(false)} disabled={deleting} style={{ padding: '10px 24px', borderRadius: '999px', border: '1.5px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: '700' }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} style={{ padding: '10px 24px', borderRadius: '999px', border: 'none', background: '#c62828', color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: '700', opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post body */}
        <div style={{
          background: '#fff', border: '1.5px solid #ffe0b2', borderRadius: '14px',
          padding: '28px 28px', marginBottom: '36px',
          boxShadow: '0 2px 8px rgba(255,152,0,0.08)',
          whiteSpace: 'pre-wrap', lineHeight: '1.9', color: '#4e342e', fontSize: '1rem',
        }}>
          {post.body}
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #ffe0b2', margin: '0 0 32px' }} />

        {/* Comments */}
        <h3 style={{ fontFamily: 'Georgia, serif', color: '#bf360c', marginBottom: '20px' }}>
          💬 Comments ({comments.length})
        </h3>

        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '28px' }}>
            <textarea
              rows="3"
              placeholder="Share your thoughts…"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px',
                border: '1.5px solid #ffcc80', borderRadius: '12px',
                fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical',
                background: '#fff8e1', color: '#4e342e', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button type="submit" disabled={submitting} style={{
              marginTop: '10px', padding: '10px 28px',
              background: 'linear-gradient(135deg, #ff9800, #e65100)',
              color: '#fff', border: 'none', borderRadius: '999px',
              fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontSize: '0.9rem',
              boxShadow: '0 3px 10px rgba(255,152,0,0.30)',
              opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Posting…' : '📤 Post Comment'}
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: '20px', color: '#795548' }}>
            <Link to="/login" style={{ color: '#e65100', fontWeight: '700' }}>Login</Link> to leave a comment.
          </p>
        )}

        {comments.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#8d6e63', textAlign: 'center', padding: '24px 0' }}>
            No comments yet — be the first! 🍴
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {comments.map(comment => {
              const canDelete = user && (comment.author?._id === user._id || isAdmin);
              return (
                <div key={comment._id} style={{
                  padding: '14px 18px', borderRadius: '12px',
                  border: '1.5px solid #ffe0b2', background: '#fff',
                  boxShadow: '0 1px 4px rgba(255,152,0,0.06)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#e65100' }}>{comment.author?.name}</strong>
                    <small style={{ color: '#8d6e63' }}>{new Date(comment.createdAt).toLocaleDateString()}</small>
                  </div>
                  <p style={{ margin: 0, color: '#4e342e', lineHeight: '1.6' }}>{comment.body}</p>
                  {canDelete && (
                    <button onClick={() => handleCommentDelete(comment._id)} style={{
                      marginTop: '10px', padding: '4px 14px',
                      background: 'transparent', border: '1px solid #e53935',
                      color: '#e53935', borderRadius: '999px', cursor: 'pointer',
                      fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: '600',
                    }}>
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '36px' }}>
          <Link to="/home" style={{ color: '#e65100', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostPage;