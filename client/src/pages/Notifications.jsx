import React, { useState, useEffect } from 'react';
import api from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error updating notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error updating all notifications:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-container notifications-page">
      <div className="notifications-header">
        <div>
          <h2>Campus Notifications</h2>
          <p>Updates on your claims, item submissions, and ownership responses</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            className="btn-mark-all-read"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>When someone claims an item you posted or acts on your claim, alerts will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${notif.read ? 'is-read' : 'is-unread'}`}
            >
              <div className="notif-indicator">
                {!notif.read && <span className="unread-dot" title="Unread"></span>}
                <span className="notif-type-icon">📣</span>
              </div>

              <div className="notif-content">
                <p className="notif-message">{notif.message}</p>
                <span className="notif-timestamp">
                  {new Date(notif.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="btn-mark-single-read"
                  title="Mark as read"
                >
                  ✓ Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
