import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Navbar = () => {
  const { user, token, logout, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchUnreadNotifications = async () => {
      if (token) {
        try {
          const res = await api.get('/notifications');
          if (isMounted) {
            const unread = res.data.filter(n => !n.read).length;
            setUnreadCount(unread);
          }
        } catch (err) {
          // ignore or silent fail
        }
      } else {
        setUnreadCount(0);
      }
    };

    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 15000); // refresh every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🎓</div>
          <div className="brand-text">
            <span className="brand-title">CampusLost&Found</span>
            <span className="brand-subtitle">Student Portal</span>
          </div>
        </Link>

        <nav className="navbar-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Browse Items
          </Link>
          <Link to="/post" className={`nav-link highlight ${location.pathname === '/post' ? 'active' : ''}`}>
            <span>+</span> Post Item
          </Link>

          {token ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                My Dashboard
              </Link>

              {isAdmin && (
                <Link to="/admin" className={`nav-link admin-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  Admin Panel
                </Link>
              )}

              <Link to="/notifications" className={`nav-link notif-link ${location.pathname === '/notifications' ? 'active' : ''}`} title="Notifications">
                <span className="bell-icon">🔔</span>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </Link>

              <div className="user-profile-badge">
                <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <div className="user-meta">
                  <span className="user-name">{user?.name}</span>
                  <span className={`user-role ${isAdmin ? 'role-admin' : 'role-student'}`}>
                    {isAdmin ? 'Admin' : 'Student'}
                  </span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn-logout" title="Sign out">
                Logout
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary">Log In</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
