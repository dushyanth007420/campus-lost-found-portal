import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';
import { SAEC_INSTAGRAM_URL, SAEC_LINKEDIN_URL, InstagramIcon, LinkedInIcon } from './components/SocialButtons';

// External social redirect component supporting React Router routing
const ExternalSocialRedirect = ({ url, platform }) => {
  React.useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div className="spinner"></div>
      <h3 style={{ marginTop: '1.5rem', color: 'var(--text-main)' }}>Opening Official {platform} Page...</h3>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
        Redirecting to <a href={url} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{url}</a>
      </p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/items/:id" element={<ItemDetail />} />

              {/* Social Navigation Routes */}
              <Route
                path="/instagram"
                element={<ExternalSocialRedirect url={SAEC_INSTAGRAM_URL} platform="Instagram" />}
              />
              <Route
                path="/linkedin"
                element={<ExternalSocialRedirect url={SAEC_LINKEDIN_URL} platform="LinkedIn" />}
              />

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/post" element={<PostItem />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="footer-container">
            <div className="footer-inner">
              <div className="footer-main-row">
                <div>
                  <p className="footer-title">&copy; {new Date().getFullYear()} Campus Lost and Found Portal &bull; S.A. Engineering College (Autonomous)</p>
                  <p className="footer-sub">Official Student & Faculty Portal &bull; Built with MERN Stack</p>
                </div>
                <div className="footer-social-group">
                  <span className="footer-social-label">Follow Us:</span>
                  <a
                    href={SAEC_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn btn-ig"
                    title="Instagram @saec_autonomous"
                  >
                    <InstagramIcon size={16} />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={SAEC_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn btn-in"
                    title="LinkedIn S.A. Engineering College"
                  >
                    <LinkedInIcon size={16} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
