// frontend/src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function RegisterPage() {
  const { setUser } = useAuth();
  const navigate    = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '', email: '', password: '',
    confirmPassword: '', dob: '', level: '', terms: false,
  });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const fieldName  = type === 'radio' ? name : id;
    setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
    setApiError('');
  };

  const validateForm = () => {
    const errs    = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullname.trim())
      errs.fullname = 'Full name is required.';
    if (!emailRx.test(formData.email))
      errs.email = 'Please enter a valid email address.';
    if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    if (!formData.level)
      errs.level = 'Please select your experience level.';
    if (!formData.terms)
      errs.terms = 'You must agree to the terms.';

    if (!formData.dob) {
      errs.dob = 'Date of birth is required.';
    } else {
      const birth = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
      if (age < 18) errs.dob = 'You must be at least 18 years old.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Register → backend returns { token, user } directly
      const { data } = await API.post('/auth/register', {
        name:     formData.fullname,
        email:    formData.email,
        password: formData.password,
      });

      // Save token + user in context — no second login call needed
      localStorage.setItem('token', data.token);
      setUser(data.user);

      navigate(data.user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      if (!err.response) {
        setApiError('Cannot connect to the server. Make sure the backend is running on port 5000.');
      } else {
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const errSpan = (key) =>
    errors[key] ? <span className="error">{errors[key]}</span> : null;

  return (
    <main className="main-content">
    <div className="content">
      <h2>Create an Account 🍜</h2>
      <p>Join the community and share your favourite Filipino recipes!</p>
      <img
        src="/pictures/buttered-shrimp.jpg"
        alt="Buttered shrimp dish"
        className="content-img"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      {apiError && (
        <div style={{
          color: '#c62828', background: 'rgba(229,57,53,0.1)',
          border: '1px solid #e53935', borderRadius: '6px',
          padding: '12px 16px', marginBottom: '16px',
          fontWeight: '600', lineHeight: '1.5',
        }}>
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="fullname">Full Name:</label>
        <input
          type="text" id="fullname"
          value={formData.fullname} onChange={handleChange}
          placeholder="Enter your full name"
        />
        {errSpan('fullname')}

        <label htmlFor="email">Email Address:</label>
        <input
          type="email" id="email"
          value={formData.email} onChange={handleChange}
          placeholder="example@mail.com"
          autoComplete="email"
        />
        {errSpan('email')}

        <label htmlFor="password">Password:</label>
        <input
          type="password" id="password"
          value={formData.password} onChange={handleChange}
          placeholder="Min. 6 characters"
          autoComplete="new-password"
        />
        {errSpan('password')}

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password" id="confirmPassword"
          value={formData.confirmPassword} onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
        />
        {errSpan('confirmPassword')}

        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date" id="dob"
          value={formData.dob} onChange={handleChange}
        />
        {errSpan('dob')}

        <label>Cooking Experience Level:</label>
        <div style={{ marginBottom: '4px' }}>
          {['beginner', 'intermediate', 'expert'].map(lvl => (
            <div key={lvl} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
              <input
                type="radio" id={lvl} name="level" value={lvl}
                checked={formData.level === lvl} onChange={handleChange}
                style={{ width:'auto', margin:0 }}
              />
              <label htmlFor={lvl} style={{ display:'inline', fontWeight:'normal', marginTop:0 }}>
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </label>
            </div>
          ))}
        </div>
        {errSpan('level')}

        <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'16px 0 4px' }}>
          <input
            type="checkbox" id="terms"
            checked={formData.terms} onChange={handleChange}
            style={{ width:'auto', margin:0 }}
          />
          <label htmlFor="terms" style={{ display:'inline', fontWeight:'normal', marginTop:0 }}>
            I agree to the terms and conditions.
          </label>
        </div>
        {errSpan('terms')}

        <button type="submit" id="newcolor" disabled={loading}>
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>

      <p style={{ marginTop:'20px', textAlign:'center' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color:'var(--snd-bg-color)', fontWeight:'bold' }}>
          Login here
        </Link>
      </p>
    </div>
    </main>
  );
}

export default RegisterPage;