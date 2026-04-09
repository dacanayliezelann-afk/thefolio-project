import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Theme from './Theme';
import logo from '../pictures/chefgirl.avif';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header>
        <div className="header-container">
          <img src={logo} alt="Chef Logo" className="header-logo" />
          <h1>ALL ABOUT COOKING</h1>
        </div>
        <Theme />
      </header>

      <nav className="horizontal-nav">
        <ul>
          <li><Link to="/home" className={isActive('/home')}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')}>About</Link></li>
          
          {user?.role?.toString().trim().toLowerCase() !== 'admin' && (
  <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
)}

          {!user && (
            <>
              <li><Link to="/register" className={isActive('/register')}>Register</Link></li>
              <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
            </>
          )}

          {user && (
            <>
              <li><Link to="/create-post" className={isActive('/create-post')}>Write Post</Link></li>
              <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
              {user.role?.toLowerCase() === 'admin' && (
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

      <main>{children}</main>

      <footer className="footer">
        <p>&copy; 2026 Student Portfolio · All About Cooking</p>
      </footer>
    </>
  );
};

export default Layout;
