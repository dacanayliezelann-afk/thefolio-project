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
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      
      {/* RESTRICT ADMIN FROM ACCESSING CONTACT PAGE */}
      <Route path="/contact" element={
        user?.role?.toLowerCase() === 'admin' ? (
          <Navigate to="/admin" replace />
        ) : (
          <Layout><ContactPage /></Layout>
        )
      } />

      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/posts/:id" element={<Layout><PostPage /></Layout>} />

      <Route path="/profile" element={
        <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
      } />
      <Route path="/create-post" element={
        <ProtectedRoute><Layout><CreatePostPage /></Layout></ProtectedRoute>
      } />
      <Route path="/edit-post/:id" element={
        <ProtectedRoute><Layout><EditPostPage /></Layout></ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute role="admin"><Layout><AdminPage /></Layout></ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
