// frontend/src/pages/ProfilePage.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API, { API_ORIGIN } from '../api/axios';

function ProfilePage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio,  setBio]  = useState(user?.bio  || '');
  const [pic,  setPic]  = useState(null);

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const [profileMsg,   setProfileMsg]   = useState('');
  const [profileError, setProfileError] = useState('');
  const [passMsg,      setPassMsg]      = useState('');
  const [passError,    setPassError]    = useState('');

  const picSrc = user?.profilePic
    ? `${API_ORIGIN}/uploads/${user.profilePic}`
    : null;

  const handleProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(''); setProfileError('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio',  bio);
    if (pic) fd.append('profilePic', pic);
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setProfileMsg('✅ Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassMsg(''); setPassError('');
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setPassMsg('✅ Password changed successfully!');
      setCurPw(''); setNewPw('');
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const msgBox = (text, isError) => (
    <div style={{
      padding: '10px 14px', borderRadius: '6px', marginBottom: '12px', fontWeight: '600',
      background: isError ? 'rgba(229,57,53,0.1)' : 'rgba(255,152,0,0.1)',
      border: `1px solid ${isError ? '#e53935' : 'var(--snd-bg-color)'}`,
      color:  isError ? '#c62828' : 'var(--text-color)',
    }}>
      {text}
    </div>
  );

  return (
    <main className="main-content">
    <div className="content">
      <h2>My Profile 👨‍🍳</h2>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        {picSrc ? (
          <img
            src={picSrc} alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover',
              border: '3px solid var(--snd-bg-color)', margin: '0 auto', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'var(--snd-bg-color)', color: 'white',
            fontSize: '2.5rem', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <p style={{ marginTop: '8px', color: 'var(--snd-bg-color)', fontSize: '0.9rem', fontWeight: '700' }}>
          {user?.email} · <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
        </p>
      </div>

      {/* Edit Profile */}
      <section style={{ marginBottom: '32px' }}>
        <h3>Edit Profile</h3>
        {profileMsg   && msgBox(profileMsg,   false)}
        {profileError && msgBox(profileError, true)}
        <form onSubmit={handleProfile}>
          <label htmlFor="p-name">Display Name:</label>
          <input id="p-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your display name" />

          <label htmlFor="p-bio">Short Bio:</label>
          <textarea id="p-bio" rows="3" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />

          <label htmlFor="p-pic">Change Profile Picture:</label>
          <input id="p-pic" type="file" accept="image/*" onChange={e => setPic(e.target.files[0])} />

          <input type="submit" id="newcolor" value="Save Profile" />
        </form>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-clr)', marginBottom: '28px' }} />

      {/* Change Password */}
      <section>
        <h3>Change Password</h3>
        {passMsg   && msgBox(passMsg,   false)}
        {passError && msgBox(passError, true)}
        <form onSubmit={handlePassword}>
          <label htmlFor="cur-pw">Current Password:</label>
          <input id="cur-pw" type="password" placeholder="Enter current password"
            value={curPw} onChange={e => setCurPw(e.target.value)} required />

          <label htmlFor="new-pw">New Password (min 6 characters):</label>
          <input id="new-pw" type="password" placeholder="Enter new password"
            value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} />

          <input type="submit" id="newcolor" value="Change Password" />
        </form>
      </section>
    </div>
   </main> 
  );
}

export default ProfilePage;