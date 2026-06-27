import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
    ]
  },
  {
    label: 'Core Banking',
    items: [
      { path: '/customers', label: 'Customers', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { path: '/accounts', label: 'Accounts', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
      { path: '/transactions', label: 'Transactions', badge: 'Live',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
    ]
  },
  {
    label: 'Financial Products',
    items: [
      { path: '/loans', label: 'Loans', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
      { path: '/cards', label: 'Cards', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/analytics', label: 'Analytics', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
      { path: '/settings', label: 'Settings', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
    ]
  },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  const roleColor = {
    admin: '#3b82f6',
    manager: '#10b981',
    teller: '#f59e0b',
    viewer: '#8b5cf6',
  };

  const initials = ((user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')) || user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-logo">N</div>
        <div>
          <div className="sb-name">Nexus<span>Bank</span></div>
          <div className="sb-tag">Enterprise Portal v2.0</div>
        </div>
      </div>

      {/* Nav */}
      <div className="sb-scroll">
        {NAV_GROUPS.map(g => (
          <div key={g.label}>
            <div className="sb-section-label">{g.label}</div>
            {g.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span className="sb-label">{item.label}</span>
                {item.badge && (
                  <span className={`sb-badge ${item.badge === 'Live' ? '' : 'amber'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar" style={{ background: `linear-gradient(135deg, ${roleColor[user?.role] || '#3b82f6'}, #8b5cf6)` }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-uname">{user?.first_name} {user?.last_name}</div>
            <div className="sb-urole" style={{ color: roleColor[user?.role] || 'var(--t-tertiary)' }}>{user?.role}</div>
          </div>
        </div>
        <button className="sb-logout" onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
