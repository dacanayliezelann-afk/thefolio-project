// frontend/src/pages/EditPostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title,        setTitle]        = useState('');
  const [body,         setBody]         = useState('');
  const [image,        setImage]        = useState(null);
  const [preview,      setPreview]      = useState(null);   // new local preview
  const [currentImage, setCurrentImage] = useState('');     // existing saved image
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setBody(res.data.body);
        setCurrentImage(res.data.image || '');
      })
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      await API.put(`/posts/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="content"><p>Loading post...</p></div>;

  return (
    <div className="content">
      <h2>✏️ Edit Post</h2>

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
        <label htmlFor="edit-title">Post Title:</label>
        <input
          id="edit-title" type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Cover image section */}
        {/* Show new preview OR existing saved image */}
        {(preview || currentImage) && (
          <div style={{ margin: '12px 0' }}>
            <label>{preview ? 'New Cover Image Preview:' : 'Current Cover Image:'}</label>
            <img
              src={preview || `http://localhost:5000/uploads/${currentImage}`}
              alt="Cover"
              style={{
                maxWidth: '100%', maxHeight: '220px', objectFit: 'cover',
                borderRadius: '8px', border: '2px solid var(--snd-bg-color)',
                display: 'block', marginTop: '8px',
              }}
            />
          </div>
        )}

        <label htmlFor="edit-image">
          {currentImage ? 'Replace Cover Image:' : 'Add a Cover Image (Optional):'}
        </label>
        <input
          id="edit-image" type="file"
          accept="image/*"
          style={{ padding: '10px 0' }}
          onChange={handleImageChange}
        />

        {preview && (
          <button
            type="button"
            onClick={() => { setImage(null); setPreview(null); }}
            style={{
              marginTop: '4px', padding: '4px 12px', fontSize: '0.82rem',
              background: 'transparent', border: '1px solid #e53935',
              color: '#e53935', borderRadius: '4px', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel New Photo
          </button>
        )}

        {/* Body */}
        <label htmlFor="edit-body" style={{ marginTop: '14px' }}>Post Content:</label>
        <textarea
          id="edit-body" rows="14"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          style={{ width: '100%' }}
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="submit" id="newcolor" disabled={saving}
            style={{ flex: 1 }}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <Link to={`/posts/${id}`} style={{
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

export default EditPostPage;