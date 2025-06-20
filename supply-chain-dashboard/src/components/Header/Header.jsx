import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__brand">
            <div className="header__logo">
              {/* Official Walmart Spark Logo */}
              <div className="walmart-logo">
                <svg width="48" height="48" viewBox="0 0 100 100" className="walmart-spark">
                  <g fill="var(--walmart-blue)">
                    <path d="M50 15 L60 35 L80 35 L65 50 L70 70 L50 60 L30 70 L35 50 L20 35 L40 35 Z"/>
                  </g>
                  <circle cx="50" cy="50" r="8" fill="var(--walmart-yellow)"/>
                </svg>
              </div>
              <div className="header__brand-text">
                <span className="header__title">Walmart</span>
                <span className="header__subtitle">Supply Chain Command Center</span>
              </div>
            </div>
          </div>
          
          <div className="header__nav">
            <nav className="header__navigation">
              <a href="#dashboard" className="nav-link nav-link--active">Dashboard</a>
              <a href="#analytics" className="nav-link">Analytics</a>
              <a href="#inventory" className="nav-link">Inventory</a>
              <a href="#logistics" className="nav-link">Logistics</a>
            </nav>
          </div>
          
          <div className="header__actions">
            <div className="header__search">
              <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input" />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            
            <div className="header__notifications">
              <button className="header__notification-btn">
                <span className="notification-icon">🔔</span>
                <span className="notification-badge">5</span>
              </button>
            </div>
            
            <div className="header__user">
              <div className="header__user-info">
                <span className="header__user-name">Deepesh Gavali</span>
                <span className="header__user-role">Operations Manager</span>
              </div>
              <div className="header__user-avatar">
                <div className="avatar-placeholder">
                  <span>DG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
