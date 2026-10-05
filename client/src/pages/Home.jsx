import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ItemCard from '../components/ItemCard';
import { HeroSocialButtons, CollegeConnectSection } from '../components/SocialButtons';

const CATEGORIES = ['ID Card', 'Phone', 'Books', 'Keys', 'Wallet', 'Bag', 'Electronics', 'Other'];

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (type) params.type = type;
      if (category) params.category = category;
      if (status) params.status = status;
      if (date) params.date = date;

      const res = await api.get('/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, category, status, date]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setCategory('');
    setStatus('');
    setDate('');
  };

  const hasActiveFilters = Boolean(search || type || category || status || date);

  // Quick statistics
  const totalCount = items.length;
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const resolvedCount = items.filter(i => i.status === 'resolved' || i.status === 'claimed').length;

  return (
    <div className="page-container home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">Official University Portal</span>
          <h1 className="hero-title">Lost Something on Campus? Or Found an Item?</h1>
          <p className="hero-desc">
            Connect directly with fellow students, staff, and faculty to report misplaced belongings or return discovered items safely and quickly.
          </p>
          <div className="hero-actions">
            <Link to="/post" className="btn-hero-primary">Report an Item Now</Link>
            <a href="#browse-section" className="btn-hero-secondary">Search Lost & Found</a>
          </div>

          {/* Quick Hero Social Buttons */}
          <HeroSocialButtons />
        </div>

        <div className="hero-stats-grid">
          <div className="stat-card">
            <span className="stat-num">{totalCount}</span>
            <span className="stat-label">Reported Items</span>
          </div>
          <div className="stat-card stat-lost">
            <span className="stat-num">{lostCount}</span>
            <span className="stat-label">Active Lost</span>
          </div>
          <div className="stat-card stat-found">
            <span className="stat-num">{foundCount}</span>
            <span className="stat-label">Found Items</span>
          </div>
          <div className="stat-card stat-resolved">
            <span className="stat-num">{resolvedCount}</span>
            <span className="stat-label">Recovered</span>
          </div>
        </div>
      </section>

      {/* College Social Connect Section */}
      <CollegeConnectSection />

      {/* Main Browse & Filter Section */}
      <section id="browse-section" className="browse-section">
        <div className="filter-panel">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by keywords, title, description, or campus location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="btn-search">Search</button>
          </form>

          {/* Quick Filter Selectors */}
          <div className="filters-row">
            <div className="filter-group">
              <label>Item Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="filter-select">
                <option value="">All Types (Lost & Found)</option>
                <option value="lost">🔍 Lost Items</option>
                <option value="found">✨ Found Items</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
                <option value="">All Statuses</option>
                <option value="open">Open (Unclaimed)</option>
                <option value="claimed">Claimed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="filter-group">
              <label>From Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="filter-date-input"
              />
            </div>

            {hasActiveFilters && (
              <div className="filter-group-action">
                <label>&nbsp;</label>
                <button type="button" onClick={handleClearFilters} className="btn-clear-filters">
                  Reset Filters ↻
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Items Listing Display */}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching items across campus...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No items match your criteria</h3>
            <p>Try refining your search terms or clearing current filter selections.</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
