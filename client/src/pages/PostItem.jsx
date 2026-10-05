import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['ID Card', 'Phone', 'Books', 'Keys', 'Wallet', 'Bag', 'Electronics', 'Other'];

const PostItem = () => {
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ID Card');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP)');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('type', type);
      formData.append('category', category);
      formData.append('location', location.trim());
      formData.append('date', date);
      formData.append('description', description.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/items/${res.data._id}`);
    } catch (err) {
      console.error('Error posting item:', err);
      setError(err.response?.data?.error || 'Failed to create item post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container post-item-page">
      <div className="post-card">
        <div className="post-header">
          <h2>Report a Campus Item</h2>
          <p>Provide accurate details so the rightful owner or finder can quickly identify it.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          {/* Item Type Selector */}
          <div className="form-group">
            <label className="group-title">What are you reporting?</label>
            <div className="type-toggle-grid">
              <label className={`type-option-card ${type === 'lost' ? 'active-lost' : ''}`}>
                <input
                  type="radio"
                  name="itemType"
                  value="lost"
                  checked={type === 'lost'}
                  onChange={() => setType('lost')}
                />
                <span className="type-icon">🔍</span>
                <span className="type-text">I LOST an Item</span>
                <span className="type-sub">I misplaced a personal item</span>
              </label>

              <label className={`type-option-card ${type === 'found' ? 'active-found' : ''}`}>
                <input
                  type="radio"
                  name="itemType"
                  value="found"
                  checked={type === 'found'}
                  onChange={() => setType('found')}
                />
                <span className="type-icon">✨</span>
                <span className="type-text">I FOUND an Item</span>
                <span className="type-sub">I discovered an item on campus</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="title">Item Title / Headline *</label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. Blue JanSport Backpack with keychains"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="location">Campus Location *</label>
              <input
                id="location"
                type="text"
                required
                placeholder="e.g. Science Block 3rd floor lab, Library table #4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="date">Date Misplaced / Found *</label>
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              rows={4}
              required
              placeholder="Describe color, brand, unique stickers, scratches, contents, or circumstances..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Image Upload with preview */}
          <div className="form-group">
            <label>Item Photograph (Optional, but recommended)</label>
            <div className="image-upload-zone">
              {imagePreview ? (
                <div className="preview-container">
                  <img src={imagePreview} alt="Item preview" className="uploaded-preview" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-remove-preview"
                  >
                    Remove Image ✕
                  </button>
                </div>
              ) : (
                <label className="file-drop-target">
                  <span className="drop-icon">📷</span>
                  <span className="drop-prompt">Click to browse or upload a photo of the item</span>
                  <span className="drop-hint">Supports PNG, JPG, JPEG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-submit-post"
            >
              {loading ? 'Submitting Report...' : `Publish ${type === 'lost' ? 'Lost' : 'Found'} Item Report`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
