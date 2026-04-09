import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext'; 

import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';

import './App.css';

function App() {
  // 1. CRITICAL: You must call useAuth() here so the 'user' variable exists
  const { user } = useAuth(); 

  return (
    <Routes>
      {/* Splash — no Layout */}
      <Route path="/" element={<SplashPage />} />

      {/* Public Routes */}
      <Route path="/home" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      
      {/* 2. Your Logic Integrated: Redirect Admin away from Contact */}
      <Route 
        path="/contact" 
        element={
          user?.role?.toLowerCase() === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : (
            <Layout><ContactPage /></Layout>
          )
        } 
      />

      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/posts/:id" element={<Layout><PostPage /></Layout>} />
      
      {/* Aliases */}
      <Route path="/contacts" element={<Navigate to="/contact" replace />} />
      <Route path="/sign-up" element={<Navigate to="/register" replace />} />
      <Route path="/log-in" element={<Navigate to="/login" replace />} />

      {/* Protected Routes */}
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
