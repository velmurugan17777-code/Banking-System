import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const DEMO = [
  { role: 'Admin', user: 'admin', pass: 'admin123' },
  { role: 'Manager', user: 'manager', pass: 'manager123' },
  { role: 'Teller', user: 'teller', pass: 'teller123' },
  { role: 'Viewer', user: 'viewer', pass: 'viewer123' },
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const r = await login(username, password);
    if (!r.success) setError(r.error || 'Invalid credentials');
    setLoading(false);
  };

  const fillDemo = (u, p) => { setUsername(u); setPassword(p); setError(''); };

  return (
    <div className="login-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* LEFT — Branding */}
      <div className="login-left">
        <div className="login-branding">
          <div className="logo">N</div>
          <h1>Enterprise<br /><em>Banking Portal</em></h1>
          <p>A corporate-grade financial management platform for modern banks — real-time transactions, analytics, and role-based controls.</p>

          <div className="login-features">
            {[
              { color: '#10b981', label: 'Role-based access control (Admin, Manager, Teller, Viewer)' },
              { color: '#3b82f6', label: 'Real-time transaction monitoring & alerts' },
              { color: '#8b5cf6', label: 'Financial analytics & KPI dashboards' },
              { color: '#f59e0b', label: 'Customer, Loan, Card & Account management' },
            ].map(f => (
              <div className="login-feat" key={f.label}>
                <div className="login-feat-dot" style={{ background: f.color + '22' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="login-right">
        <div className="login-form-box">
          <h2>Sign In</h2>
          <p>Access your banking dashboard</p>

          {location.state?.message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--green)', padding: '10px 14px', fontSize: '0.84rem', marginBottom: '18px' }}>{location.state.message}</div>}
          {error && <div className="err-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="field-label">Username</label>
              <div className="inp-wrap">
                <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input className="inp with-icon" type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                <button type="button" className="btn-ghost" style={{ fontSize: '0.76rem' }}>Forgot password?</button>
              </div>
              <div className="inp-wrap">
                <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input className="inp with-icon" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <button className="btn-brand w-100 justify-content-center py-2" style={{ marginTop: 8, fontSize: '0.92rem' }} disabled={loading}>
              {loading ? <span className="spin" /> : <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign in to Dashboard
              </>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--t-tertiary)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--brand-light)', fontWeight: 600 }}>Register now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
