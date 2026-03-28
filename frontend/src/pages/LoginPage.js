// frontend/src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      console.log('Login success:', user);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) {
        setError('Cannot connect to the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
    <div className="content">
      <h2>Login 🍳</h2>

      {error && (
        <div style={{
          color: '#c62828', background: 'rgba(229,57,53,0.1)',
          border: '1px solid #e53935', borderRadius: '6px',
          padding: '12px 16px', marginBottom: '16px',
          fontWeight: '600', lineHeight: '1.5',
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email" id="email"
          placeholder="foodie@example.com"
          value={email} onChange={e => setEmail(e.target.value)}
          required autoComplete="email"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password" id="password"
          placeholder="Enter your password"
          value={password} onChange={e => setPassword(e.target.value)}
          required autoComplete="current-password"
        />

        <input
          type="submit" id="newcolor"
          value={loading ? 'Logging in...' : 'Login'}
          disabled={loading}
        />
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--snd-bg-color)', fontWeight: 'bold' }}>
          Register here
        </Link>
      </p>
    </div>
    </main>
  );
}

export default LoginPage;