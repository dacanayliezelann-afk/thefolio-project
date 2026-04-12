// frontend/src/pages/EditPostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

// Compress + convert image file → base64 string
function imageFileToBase64(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title,        setTitle]        = useState('');
  const [body,         setBody]         = useState('');
  const [newPreview,   setNewPreview]   = useState(null);   // newly chosen base64
  const [currentImage, setCurrentImage] = useState('');     // existing base64 from DB
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const b64 = await imageFileToBase64(file);
      setNewPreview(b64);
    } catch {
      setError('Could not process image. Please try another file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Send new image if chosen, otherwise keep current
      await API.put(`/posts/${id}`, {
        title,
        body,
        image: newPreview !== null ? newPreview : currentImage,
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  /* ── shared styles ── */
  const labelStyle = {
    display: 'block',
    fontWeight: '700',
    color: '#bf360c',
    marginBottom: '6px',
    marginTop: '20px',
    fontSize: '0.93rem',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #ffcc80',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    background: '#fffbf0',
    color: '#4e342e',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const focusOn  = e => { e.target.style.borderColor = '#ff9800'; e.target.style.boxShadow = '0 0 0 3px rgba(255,152,0,0.18)'; };
  const focusOff = e => { e.target.style.borderColor = '#ffcc80'; e.target.style.boxShadow = 'none'; };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#ff9800' }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
      <p style={{ color: '#8d6e63' }}>Loading post…</p>
    </div>
  );

  // The image to display: new choice takes priority, else existing DB image
  const displayImage = newPreview || (currentImage && currentImage.startsWith('data:') ? currentImage : null);

  return (
    <div style={{ background: '#fffbf0', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Page header banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ff9800 0%, #e65100 100%)',
        padding: '32px 24px 28px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '2.4rem', margin: '0 0 6px', lineHeight: 1 }}>✏️</p>
        <h2 style={{
          color: '#fff', fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.4rem,4vw,2rem)',
          margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}>
          Edit Post
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0', fontSize: '0.95rem' }}>
          Update your recipe or cooking story
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '20px',
        boxShadow: '0 8px 40px rgba(255,152,0,0.13)',
        border: '1.5px solid #ffe0b2',
        padding: '36px 32px',
        maxWidth: '720px', margin: '32px auto',
      }}>

        {error && (
          <div style={{
            color: '#c62828', background: 'rgba(229,57,53,0.09)',
            border: '1.5px solid #e53935', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '18px', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <label style={labelStyle} htmlFor="edit-title">Post Title</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
          />

          {/* Current or new image preview */}
          {displayImage && (
            <div style={{ margin: '18px 0 8px' }}>
              <p style={{ ...labelStyle, marginTop: 0 }}>
                {newPreview ? 'New Cover Image Preview' : 'Current Cover Image'}
              </p>
              <img
                src={displayImage}
                alt="Cover"
                style={{
                  width: '100%', maxHeight: '240px', objectFit: 'cover',
                  borderRadius: '12px', border: '2px solid #ffe0b2', display: 'block',
                }}
              />
            </div>
          )}

          {/* Upload zone */}
          <label style={labelStyle} htmlFor="edit-image">
            {currentImage ? 'Replace Cover Image' : 'Add a Cover Image'}{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', color: '#8d6e63' }}>(optional)</span>
          </label>

          <label htmlFor="edit-image" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            border: '2px dashed #ffcc80', borderRadius: '12px',
            padding: '18px 16px', cursor: 'pointer', background: '#fff8e1',
            transition: 'border-color 0.2s, background 0.2s',
            marginBottom: '8px',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff9800'; e.currentTarget.style.background = '#fff3cd'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffcc80'; e.currentTarget.style.background = '#fff8e1'; }}
          >
            <span style={{ fontSize: '1.8rem' }}>🖼️</span>
            <span style={{ color: '#e65100', fontWeight: '700', fontSize: '0.92rem' }}>
              Click to choose a new image
            </span>
            <span style={{ color: '#8d6e63', fontSize: '0.8rem' }}>JPG, PNG, GIF, WEBP · max 5 MB</span>
            <input
              id="edit-image"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </label>

          {newPreview && (
            <button
              type="button"
              onClick={() => setNewPreview(null)}
              style={{
                padding: '5px 16px', fontSize: '0.82rem',
                background: 'transparent', border: '1.5px solid #e53935',
                color: '#e53935', borderRadius: '999px', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: '600', marginBottom: '4px',
              }}
            >
              ✕ Cancel New Photo
            </button>
          )}

          {/* Body */}
          <label style={{ ...labelStyle, marginTop: '20px' }} htmlFor="edit-body">Post Content</label>
          <textarea
            id="edit-body"
            rows="14"
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
            onFocus={focusOn}
            onBlur={focusOff}
          />

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1, padding: '13px 20px',
                background: saving ? '#ffcc80' : 'linear-gradient(135deg, #ff9800, #e65100)',
                color: '#fff', border: 'none', borderRadius: '999px',
                fontWeight: '800', fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: saving ? 'none' : '0 4px 16px rgba(255,152,0,0.35)',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              {saving ? '⏳ Saving…' : '💾 Save Changes'}
            </button>

            <Link to={`/posts/${id}`} style={{
              padding: '13px 24px',
              background: 'transparent',
              border: '2px solid #ffcc80',
              color: '#e65100',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e65100'; e.currentTarget.style.background = '#fff3e0'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffcc80'; e.currentTarget.style.background = 'transparent'; }}
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditPostPage;