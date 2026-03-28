// frontend/src/components/Layout.js
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Theme from './Theme';
import logo from '../pictures/chefgirl.avif';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* ── Header ── */}
      <header>
        <div className="header-container">
          <img
            src={logo}
            alt="Chef Logo"
            className="header-logo"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1>ALL ABOUT COOKING</h1>
        </div>
        <Theme />
      </header>

      {/* ── Navigation ── */}
      <nav className="horizontal-nav">
        <ul>
          <li><Link to="/home"    className={isActive('/home')}>Home</Link></li>
          <li><Link to="/about"   className={isActive('/about')}>About</Link></li>
          <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>

          {!user && (
            <>
              <li><Link to="/register" className={isActive('/register')}>Register</Link></li>
              <li><Link to="/login"    className={isActive('/login')}>Login</Link></li>
            </>
          )}

          {user && (
            <>
              <li><Link to="/create-post" className={isActive('/create-post')}>Write Post</Link></li>
              <li><Link to="/profile"     className={isActive('/profile')}>Profile</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin" className={isActive('/admin')}>Admin</Link></li>
              )}
              <li>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Logout ({user.name})
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* ── Page Content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a
            href="mailto:dacanayliezelann@gmail.com"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffee', textDecoration: 'none', fontSize: '0.82rem' }}
          >
            <img
              src="/pictures/gmail.png"
              alt="Gmail"
              style={{ width: '18px', height: '18px', borderRadius: '3px', border: 'none', margin: 0 }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            dacanayliezelann@gmail.com
          </a>
          <a
            href="https://facebook.com/dacanayliezelann"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffee', textDecoration: 'none', fontSize: '0.82rem' }}
          >
            <img
              src="/pictures/facebook.png"
              alt="Facebook"
              style={{ width: '18px', height: '18px', borderRadius: '3px', border: 'none', margin: 0 }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            dacanayliezelann@facebook.com
          </a>
        </div>
        <p>&copy; 2026 Student Portfolio · All About Cooking</p>
      </footer>
    </>
  );
};

export default Layout;