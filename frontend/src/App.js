import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext'; // Added useAuth import

import SplashPage     from './pages/SplashPage';
import HomePage        from './pages/HomePage';
import AboutPage       from './pages/AboutPage';
import ContactPage     from './pages/ContactPage';
import RegisterPage    from './pages/RegisterPage';
import LoginPage       from './pages/LoginPage';
import PostPage        from './pages/PostPage';
import ProfilePage     from './pages/ProfilePage';
import CreatePostPage  from './pages/CreatePostPage';
import EditPostPage    from './pages/EditPostPage';
import AdminPage       from './pages/AdminPage';

import './App.css';

function App() {
  const { user } = useAuth(); // Access user state to check for admin role

  return (
    <Routes>
      {/* Splash — no Layout */}
      <Route path="/" element={<SplashPage />} />

      {/* Public — wrapped in Layout */}
      <Route path="/home"      element={<Layout><HomePage /></Layout>} />
      <Route path="/about"     element={<Layout><AboutPage /></Layout>} />
      
      {/* Restricted Contact Route: Redirects Admins to their dashboard */}
      <Route path="/contact"   element={
        user?.role === 'admin' ? (
          <Navigate to="/admin" replace />
        ) : (
          <Layout><ContactPage /></Layout>
        )
      } />

      <Route path="/register"  element={<Layout><RegisterPage /></Layout>} />
      <Route path="/login"     element={<Layout><LoginPage /></Layout>} />
      <Route path="/posts/:id" element={<Layout><PostPage /></Layout>} />
      
      {/* Backward-compatible aliases */}
      <Route path="/contacts"  element={<Navigate to="/contact" replace />} />
      <Route path="/sign-up"   element={<Navigate to="/register" replace />} />
      <Route path="/log-in"    element={<Navigate to="/login" replace />} />
      <Route path="/post"      element={<Navigate to="/home" replace />} />
      <Route path="/post/:id"  element={<Layout><PostPage /></Layout>} />

      {/* Protected — must be logged in */}
      <Route path="/profile" element={
        <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
      } />
      <Route path="/create-post" element={
        <ProtectedRoute><Layout><CreatePostPage /></Layout></ProtectedRoute>
      } />
      <Route path="/edit-post/:id" element={
        <ProtectedRoute><Layout><EditPostPage /></Layout></ProtectedRoute>
      } />

      {/* Admin only */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><Layout><AdminPage /></Layout></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
