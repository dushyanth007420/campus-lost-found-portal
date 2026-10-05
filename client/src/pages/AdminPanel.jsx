import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'users'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, itemsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/items')
      ]);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('ADMIN ACTION: Permanently remove this item from the platform?')) return;
    try {
      await api.delete(`/admin/items/${itemId}`);
      setActionMessage({ text: 'Item deleted by administrator.', type: 'info' });
      setItems(prev => prev.filter(i => i._id !== itemId));
    } catch (err) {
      setActionMessage({
        text: err.response?.data?.error || 'Failed to delete item.',
        type: 'error'
      });
    }
  };

  return (
    <div className="page-container admin-page">
      <div className="admin-header">
        <div>
          <span className="admin-badge-pill">🛡️ Administrative Console</span>
          <h2>Campus Lost & Found Administration</h2>
          <p>Oversee all registered students, manage published items, and enforce college policies.</p>
        </div>
      </div>

      {actionMessage.text && (
        <div className={`alert alert-${actionMessage.type}`}>
          {actionMessage.text}
          <button onClick={() => setActionMessage({ text: '', type: '' })} className="alert-close">✕</button>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {/* Admin Stat Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-label">Total Registered Accounts</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Total Items Posted</span>
          <span className="stat-value">{items.length}</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Lost Reports</span>
          <span className="stat-value">{items.filter(i => i.type === 'lost').length}</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Found Reports</span>
          <span className="stat-value">{items.filter(i => i.type === 'found').length}</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Manage All Items ({items.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading administration data...</p>
        </div>
      ) : (
        <div className="admin-tab-content">
          {activeTab === 'items' && (
            <div className="dashboard-table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Posted By</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="table-item-cell">
                          {item.imagePath ? (
                            <img
                              src={`${API_BASE_URL}${item.imagePath}`}
                              alt={item.title}
                              className="table-item-thumb"
                            />
                          ) : (
                            <div className="table-item-thumb-placeholder">📦</div>
                          )}
                          <div>
                            <Link to={`/items/${item._id}`} className="table-item-title">
                              {item.title}
                            </Link>
                            <span className="table-item-loc">📍 {item.location}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-type badge-${item.type}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <div className="user-table-meta">
                          <span className="user-name">{item.postedBy?.name || 'N/A'}</span>
                          <span className="user-email">{item.postedBy?.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill pill-${item.status}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/items/${item._id}`} className="btn-table-action btn-action-view">
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="btn-table-action btn-action-delete"
                            title="Admin Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="dashboard-table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>College Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="table-user-cell">
                          <div className="table-user-avatar">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="table-user-name">{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'Not provided'}</td>
                      <td>
                        <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-student'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
