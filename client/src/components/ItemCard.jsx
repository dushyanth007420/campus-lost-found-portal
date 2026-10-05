import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';

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

const ItemCard = ({ item }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`item-card card-type-${item.type}`}>
      <div className="item-card-image-wrap">
        {item.imagePath ? (
          <img
            src={`${API_BASE_URL}${item.imagePath}`}
            alt={item.title}
            className="item-card-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="item-card-fallback-img"
          style={{ display: item.imagePath ? 'none' : 'flex' }}
        >
          <span className="fallback-category-icon">
            {categoryIcons[item.category] || '📦'}
          </span>
          <span className="fallback-category-label">{item.category}</span>
        </div>

        <div className="card-top-badges">
          <span className={`badge-type badge-${item.type}`}>
            {item.type === 'lost' ? '🔍 Lost' : '✨ Found'}
          </span>
          <span className={`badge-status badge-status-${item.status}`}>
            {item.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="item-card-body">
        <div className="item-card-meta">
          <span className="meta-category">
            {categoryIcons[item.category] || '🏷️'} {item.category}
          </span>
          <span className="meta-date">📅 {formattedDate}</span>
        </div>

        <h3 className="item-card-title">{item.title}</h3>

        <div className="item-card-location">
          <span className="location-pin">📍</span>
          <span>{item.location}</span>
        </div>

        <p className="item-card-desc">
          {item.description.length > 95
            ? `${item.description.substring(0, 95)}...`
            : item.description}
        </p>

        <div className="item-card-footer">
          <span className="posted-by-label">
            By: {item.postedBy?.name || 'Anonymous Student'}
          </span>
          <Link to={`/items/${item._id}`} className="btn-view-details">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
