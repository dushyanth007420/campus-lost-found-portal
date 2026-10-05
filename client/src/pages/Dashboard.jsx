import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'incoming-claims' | 'my-claims'

  // Data states
  const [myPosts, setMyPosts] = useState([]);
  const [incomingClaims, setIncomingClaims] = useState([]);
  const [myClaims, setMyClaims] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user's own items
      const itemsRes = await api.get('/items');
      const userItems = itemsRes.data.filter(
        item => item.postedBy?._id === user?.id || item.postedBy?._id === user?._id
      );
      setMyPosts(userItems);

      // 2. Fetch incoming claims on user's posted items
      const incomingRes = await api.get('/claims/my-items');
      setIncomingClaims(incomingRes.data);

      // 3. Fetch user's submitted claims
      const myClaimsRes = await api.get('/claims/my-claims');
      setMyClaims(myClaimsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleApproveClaim = async (claimId) => {
    if (!window.confirm('Approve this claim? This will mark your item as Claimed and reject other pending claims.')) return;
    setActionLoading(true);
    try {
      await api.put(`/claims/${claimId}/approve`);
      setMessage({ text: 'Claim approved successfully!', type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to approve claim', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClaim = async (claimId) => {
    if (!window.confirm('Reject this claim?')) return;
    setActionLoading(true);
    try {
      await api.put(`/claims/${claimId}/reject`);
      setMessage({ text: 'Claim rejected.', type: 'info' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to reject claim', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveItem = async (itemId) => {
    if (!window.confirm('Mark this item as resolved?')) return;
    setActionLoading(true);
    try {
      await api.put(`/items/${itemId}/resolve`);
      setMessage({ text: 'Item marked as resolved!', type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to resolve item', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/items/${itemId}`);
      setMessage({ text: 'Item listing deleted.', type: 'info' });
      fetchDashboardData();
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to delete item', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container dashboard-page">
      <div className="dashboard-header">
        <div>
          <h2>Student Dashboard</h2>
          <p>Manage your reported items and oversee verification claims</p>
        </div>
        <Link to="/post" className="btn-primary">
          + Report New Item
        </Link>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ text: '', type: '' })} className="alert-close">✕</button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          My Posted Items ({myPosts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'incoming-claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming-claims')}
        >
          Claims on My Items ({incomingClaims.filter(c => c.status === 'pending').length} Pending)
        </button>
        <button
          className={`tab-btn ${activeTab === 'my-claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-claims')}
        >
          My Submitted Claims ({myClaims.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard records...</p>
        </div>
      ) : (
        <div className="dashboard-tab-content">
          {/* TAB 1: My Posts */}
          {activeTab === 'posts' && (
            <div>
              {myPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>You haven't reported any items yet</h3>
                  <p>Misplaced something or found an item on campus? Report it right away.</p>
                  <Link to="/post" className="btn-primary">Report an Item</Link>
                </div>
              ) : (
                <div className="dashboard-table-card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Reported Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPosts.map((item) => (
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
                                <div className="table-item-thumb-placeholder">🏷️</div>
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
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-pill pill-${item.status}`}>
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <Link to={`/items/${item._id}`} className="btn-table-action btn-action-view">
                                View
                              </Link>
                              {item.status !== 'resolved' && (
                                <button
                                  onClick={() => handleResolveItem(item._id)}
                                  disabled={actionLoading}
                                  className="btn-table-action btn-action-resolve"
                                  title="Mark Resolved"
                                >
                                  Resolve
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteItem(item._id)}
                                disabled={actionLoading}
                                className="btn-table-action btn-action-delete"
                                title="Delete Listing"
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
            </div>
          )}

          {/* TAB 2: Incoming Claims */}
          {activeTab === 'incoming-claims' && (
            <div>
              {incomingClaims.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🤝</div>
                  <h3>No claims received yet</h3>
                  <p>When someone claims one of your posted items, their verification message will appear here.</p>
                </div>
              ) : (
                <div className="claims-grid">
                  {incomingClaims.map((claim) => (
                    <div key={claim._id} className={`claim-card-item status-${claim.status}`}>
                      <div className="claim-item-header">
                        <div>
                          <span className="claim-item-label">Target Item:</span>
                          <h4 className="claim-item-title">
                            {claim.item ? (
                              <Link to={`/items/${claim.item._id}`}>{claim.item.title}</Link>
                            ) : (
                              'Unknown Item (Deleted)'
                            )}
                          </h4>
                        </div>
                        <span className={`claim-status-tag status-${claim.status}`}>
                          {claim.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="claimant-info-box">
                        <span className="info-tag">Claimant Information</span>
                        <p><strong>Name:</strong> {claim.claimant?.name}</p>
                        <p><strong>Email:</strong> {claim.claimant?.email}</p>
                        {claim.claimant?.phone && <p><strong>Phone:</strong> {claim.claimant?.phone}</p>}
                      </div>

                      <div className="claim-message-box">
                        <span className="info-tag">Claimant's Verification Message</span>
                        <p className="claim-message-text">"{claim.message}"</p>
                        <span className="claim-date">
                          Submitted on {new Date(claim.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {claim.status === 'pending' && (
                        <div className="claim-action-buttons">
                          <button
                            onClick={() => handleApproveClaim(claim._id)}
                            disabled={actionLoading}
                            className="btn-approve"
                          >
                            ✓ Approve Claim
                          </button>
                          <button
                            onClick={() => handleRejectClaim(claim._id)}
                            disabled={actionLoading}
                            className="btn-reject"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: My Claims */}
          {activeTab === 'my-claims' && (
            <div>
              {myClaims.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>You haven't submitted any claims yet</h3>
                  <p>If you see an item that belongs to you or that you found, submit a claim from its detail page.</p>
                  <Link to="/" className="btn-primary">Browse Listings</Link>
                </div>
              ) : (
                <div className="claims-grid">
                  {myClaims.map((claim) => (
                    <div key={claim._id} className={`claim-card-item status-${claim.status}`}>
                      <div className="claim-item-header">
                        <div>
                          <span className="claim-item-label">Claimed Item:</span>
                          <h4 className="claim-item-title">
                            {claim.item ? (
                              <Link to={`/items/${claim.item._id}`}>{claim.item.title}</Link>
                            ) : (
                              'Item No Longer Available'
                            )}
                          </h4>
                          {claim.item && (
                            <span className="claim-item-location">📍 {claim.item.location}</span>
                          )}
                        </div>
                        <span className={`claim-status-tag status-${claim.status}`}>
                          {claim.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="claim-message-box">
                        <span className="info-tag">Your Claim Verification Note</span>
                        <p className="claim-message-text">"{claim.message}"</p>
                        <span className="claim-date">
                          Submitted on {new Date(claim.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="claim-status-explanation">
                        {claim.status === 'pending' && (
                          <p className="status-note note-pending">
                            ⏳ Waiting for the item poster to review your message and proof.
                          </p>
                        )}
                        {claim.status === 'approved' && (
                          <p className="status-note note-approved">
                            🎉 Your claim was approved! You can coordinate retrieval with the poster.
                          </p>
                        )}
                        {claim.status === 'rejected' && (
                          <p className="status-note note-rejected">
                            ❌ This claim was declined by the reporter.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
