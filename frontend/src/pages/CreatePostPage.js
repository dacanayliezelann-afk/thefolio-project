// frontend/src/pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function CreatePostPage() {
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [image,    setImage]    = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    // Show a local preview before uploading
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      const { data } = await API.post('/posts', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <h2>✏️ Write a New Post</h2>

      {error && (
        <div style={{
          color: '#c62828', background: 'rgba(229,57,53,0.1)',
          border: '1px solid #e53935', borderRadius: '6px',
          padding: '10px 14px', marginBottom: '14px', fontWeight: '600',
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label htmlFor="post-title">Post Title:</label>
        <input
          id="post-title" type="text"
          placeholder="Enter an engaging title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Cover Image — available to ALL logged-in users */}
        <label htmlFor="post-image">Cover Photo (Optional):</label>
        <input
          id="post-image" type="file"
          accept="image/*"
          style={{ padding: '10px 0' }}
          onChange={handleImageChange}
        />

        {/* Local image preview */}
        {preview && (
          <div style={{ margin: '10px 0' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%', maxHeight: '240px', objectFit: 'cover',
                borderRadius: '8px', border: '2px solid var(--snd-bg-color)',
                display: 'block',
              }}
            />
            <button
              type="button"
              onClick={() => { setImage(null); setPreview(null); }}
              style={{
                marginTop: '6px', padding: '4px 12px', fontSize: '0.82rem',
                background: 'transparent', border: '1px solid #e53935',
                color: '#e53935', borderRadius: '4px', cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Remove Photo
            </button>
          </div>
        )}

        {/* Body */}
        <label htmlFor="post-body">Post Content:</label>
        <textarea
          id="post-body" rows="14"
          placeholder="Share your recipe or cooking story..."
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          style={{ width: '100%' }}
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="submit" id="newcolor" disabled={loading}
            style={{ flex: 1 }}>
            {loading ? 'Publishing...' : '🚀 Publish Post'}
          </button>
          <Link to="/home" style={{
            padding: '12px 20px',
            background: 'transparent',
            border: '2px solid var(--snd-bg-color)',
            color: 'var(--snd-bg-color)',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreatePostPage;