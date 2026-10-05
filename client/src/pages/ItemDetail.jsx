import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';

const categoryIcons = {
  'ID Card': '🪪',
  'Phone': '📱',
  'Books': '📚',
  'Keys': '🔑',
  'Wallet': '👛',
  'Bag': '🎒',
  'Electronics': '💻',
  'Other': '📦'
};

const ItemDetail = () => {
  const { id } = useParams();
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim submission state
  const [claimMessage, setClaimMessage] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');

  // Resolution / delete actions state
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError('Item not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) {
      setClaimError('Please provide proof or details supporting your claim.');
      return;
    }

    setSubmittingClaim(true);
    setClaimError('');
    setClaimSuccess('');

    try {
      await api.post('/claims', {
        itemId: id,
        message: claimMessage.trim()
      });
      setClaimSuccess('Your claim request has been submitted successfully! The item poster has been notified.');
      setClaimMessage('');
    } catch (err) {
      console.error('Error claiming item:', err);
      setClaimError(err.response?.data?.error || 'Failed to submit claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!window.confirm('Are you sure you want to mark this item as resolved?')) return;
    setActionLoading(true);
    try {
      await api.put(`/items/${id}/resolve`);
      await fetchItem();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update item status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this item listing?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete item');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>Item Not Found</h3>
          <p>{error || 'This listing does not exist or may have been removed.'}</p>
          <Link to="/" className="btn-primary">Browse Other Items</Link>
        </div>
      </div>
    );
  }

  const isOwner = user && (item.postedBy?._id === user.id || item.postedBy?._id === user._id);
  const canManage = isOwner || isAdmin;

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="page-container item-detail-page">
      <div className="detail-top-nav">
        <button onClick={() => navigate(-1)} className="btn-back">
          &larr; Back to Listings
        </button>
      </div>

      <div className="detail-layout">
        {/* Left Column: Media & Core Info */}
        <div className="detail-main-card">
          <div className="detail-image-box">
            {item.imagePath ? (
              <img
                src={`${API_BASE_URL}${item.imagePath}`}
                alt={item.title}
                className="detail-large-img"
              />
            ) : (
              <div className="detail-fallback-img">
                <span className="detail-category-icon">
                  {categoryIcons[item.category] || '📦'}
                </span>
                <span className="detail-category-caption">No photo uploaded</span>
              </div>
            )}

            <div className="detail-badges-overlay">
              <span className={`badge-type badge-${item.type}`}>
                {item.type === 'lost' ? '🔍 Lost' : '✨ Found'}
              </span>
              <span className={`badge-status badge-status-${item.status}`}>
                Status: {item.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="detail-content-section">
            <h1 className="detail-title">{item.title}</h1>

            <div className="detail-key-info-grid">
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">
                  {categoryIcons[item.category] || '🏷️'} {item.category}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Location on Campus</span>
                <span className="info-value">📍 {item.location}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Date Reported</span>
                <span className="info-value">📅 {formattedDate}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Current Status</span>
                <span className={`info-value status-pill pill-${item.status}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="detail-description-block">
              <h3>Description & Additional Information</h3>
              <p className="detail-description-text">{item.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Reporter Contact & Claim / Management Form */}
        <div className="detail-sidebar">
          {/* Posted By Card */}
          <div className="sidebar-card reporter-card">
            <h3>Posted By</h3>
            <div className="reporter-profile">
              <div className="reporter-avatar">
                {item.postedBy?.name ? item.postedBy.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="reporter-meta">
                <h4>{item.postedBy?.name || 'Verified Student'}</h4>
                <p className="reporter-email">✉️ {item.postedBy?.email}</p>
                {item.postedBy?.phone && (
                  <p className="reporter-phone">📞 {item.postedBy?.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Owner/Admin Management Controls */}
          {canManage && (
            <div className="sidebar-card management-card">
              <h3>Manage Your Listing</h3>
              <p className="sidebar-note">
                You are recognized as the listing author {isAdmin && !isOwner ? '(via Admin Privileges)' : ''}.
              </p>

              <div className="management-actions">
                {item.status !== 'resolved' && (
                  <button
                    onClick={handleMarkResolved}
                    disabled={actionLoading}
                    className="btn-mark-resolved"
                  >
                    Mark as Resolved & Closed
                  </button>
                )}

                <button
                  onClick={handleDeleteItem}
                  disabled={actionLoading}
                  className="btn-danger-outline"
                >
                  Delete This Listing
                </button>
              </div>
            </div>
          )}

          {/* Claim Submission Form for other users */}
          {!isOwner && (
            <div className="sidebar-card claim-card">
              <h3>Claim This Item</h3>
              <p className="sidebar-note">
                {item.type === 'found'
                  ? 'Is this your lost item? Submit a claim with proof of ownership.'
                  : 'Did you find this item? Message the reporter to arrange safe return.'}
              </p>

              {item.status === 'resolved' ? (
                <div className="alert alert-info">
                  This item has already been marked as resolved.
                </div>
              ) : item.status === 'claimed' ? (
                <div className="alert alert-info">
                  A claim has already been approved for this item.
                </div>
              ) : token ? (
                <form onSubmit={handleClaimSubmit} className="claim-form">
                  {claimSuccess && <div className="alert alert-success">{claimSuccess}</div>}
                  {claimError && <div className="alert alert-error">{claimError}</div>}

                  <div className="form-group">
                    <label htmlFor="claimMsg">
                      Claim Message & Verification Details
                    </label>
                    <textarea
                      id="claimMsg"
                      rows={4}
                      required
                      placeholder="e.g. 'I can unlock this phone with PIN 1234', 'The wallet has my student ID card inside', or 'I have kept it at the security desk'..."
                      value={claimMessage}
                      onChange={(e) => setClaimMessage(e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingClaim}
                    className="btn-primary btn-submit-claim"
                  >
                    {submittingClaim ? 'Submitting...' : 'Submit Claim Request'}
                  </button>
                </form>
              ) : (
                <div className="claim-login-prompt">
                  <p>You must be signed in with your college account to submit a claim.</p>
                  <Link
                    to="/login"
                    state={{ from: { pathname: `/items/${id}` } }}
                    className="btn-primary"
                  >
                    Log In to Claim
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
