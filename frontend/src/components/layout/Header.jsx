import React, { useState } from 'react';

const Header = ({ title, subtitle }) => {
  const [time] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  return (
    <header className="top-bar">
      <div className="tb-left">
        <div>
          <div className="tb-title">{title}</div>
          {subtitle && <div className="tb-breadcrumb">Banking Portal / <span>{title}</span></div>}
        </div>
      </div>

      <div className="tb-right">
        <div className="tb-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search..." />
        </div>

        {/* Live clock */}
        <div style={{ fontSize: '0.78rem', color: 'var(--t-tertiary)', padding: '0 8px', borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
          <div style={{ color: 'var(--t-secondary)', fontWeight: 600 }}>{time}</div>
          <div style={{ fontSize: '0.7rem' }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>

        <button className="tb-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notif-dot" />
        </button>

        <button className="tb-btn" title="Help">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <button className="tb-btn" title="Full Screen" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
