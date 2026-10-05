import React from 'react';

export const SAEC_INSTAGRAM_URL = 'https://www.instagram.com/saec_autonomous/';
export const SAEC_LINKEDIN_URL = 'https://www.linkedin.com/company/sa-engineering-college-autonomous/posts/?feedView=all';

export const InstagramIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const LinkedInIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// Quick Hero / Inline Social Buttons
export const HeroSocialButtons = () => {
  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="hero-social-block">
      <span className="hero-social-label">Official College Handles:</span>
      <div className="hero-social-buttons">
        <button
          type="button"
          onClick={() => handleOpen(SAEC_INSTAGRAM_URL)}
          className="btn-social-hero btn-social-instagram"
          title="Open S.A. Engineering College Instagram"
          id="hero-instagram-btn"
        >
          <InstagramIcon size={18} />
          <span>Instagram</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpen(SAEC_LINKEDIN_URL)}
          className="btn-social-hero btn-social-linkedin"
          title="Open S.A. Engineering College LinkedIn"
          id="hero-linkedin-btn"
        >
          <LinkedInIcon size={18} />
          <span>LinkedIn</span>
        </button>
      </div>
    </div>
  );
};

// Full College Connect Banner Section for Home Page
export const CollegeConnectSection = () => {
  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="college-connect-section" id="campus-socials">
      <div className="connect-card">
        <div className="connect-header-wrap">
          <div className="connect-badge">
            <span className="badge-glow-dot"></span>
            <span>Official University Channels</span>
          </div>
          <h2 className="connect-title">Connect with S.A. Engineering College (Autonomous)</h2>
          <p className="connect-subtitle">
            Touch or click below to visit our official Instagram and LinkedIn pages for campus circulars,
            lost & found community broadcasts, academic highlights, and campus events.
          </p>
        </div>

        <div className="social-cards-grid">
          {/* Instagram Card Button */}
          <div
            className="social-portal-card card-instagram"
            onClick={() => handleOpen(SAEC_INSTAGRAM_URL)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpen(SAEC_INSTAGRAM_URL)}
            id="card-btn-instagram"
          >
            <div className="card-top-row">
              <div className="social-avatar ig-avatar">
                <InstagramIcon size={28} />
              </div>
              <span className="external-tag">Open Profile ↗</span>
            </div>
            <div className="social-details">
              <h3 className="social-channel-title">Instagram</h3>
              <p className="social-handle">@saec_autonomous</p>
              <p className="social-desc">
                Follow for campus photo stories, reels, instant lost item notices, and student updates.
              </p>
            </div>
            <button
              type="button"
              className="btn-open-channel btn-ig-action"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(SAEC_INSTAGRAM_URL);
              }}
            >
              <InstagramIcon size={18} />
              <span>Visit @saec_autonomous</span>
            </button>
          </div>

          {/* LinkedIn Card Button */}
          <div
            className="social-portal-card card-linkedin"
            onClick={() => handleOpen(SAEC_LINKEDIN_URL)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpen(SAEC_LINKEDIN_URL)}
            id="card-btn-linkedin"
          >
            <div className="card-top-row">
              <div className="social-avatar in-avatar">
                <LinkedInIcon size={28} />
              </div>
              <span className="external-tag">Open Profile ↗</span>
            </div>
            <div className="social-details">
              <h3 className="social-channel-title">LinkedIn</h3>
              <p className="social-handle">S.A. Engineering College (Autonomous)</p>
              <p className="social-desc">
                Stay updated with professional announcements, placement drives, faculty achievements, and official posts.
              </p>
            </div>
            <button
              type="button"
              className="btn-open-channel btn-in-action"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(SAEC_LINKEDIN_URL);
              }}
            >
              <LinkedInIcon size={18} />
              <span>Visit SAEC LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
