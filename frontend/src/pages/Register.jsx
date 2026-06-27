import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register/', formData);
      // On success, redirect to login page
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.detail) {
        const firstErrorKey = Object.keys(err.response.data)[0];
        const firstErrorMsg = err.response.data[firstErrorKey];
        setError(`${firstErrorKey}: ${firstErrorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* LEFT — Branding */}
      <div className="login-left">
        <div className="login-branding">
          <div className="logo">N</div>
          <h1>Enterprise<br /><em>Banking Portal</em></h1>
          <p>Join the next generation corporate-grade financial management platform.</p>

          <div className="login-features">
            {[
              { color: '#10b981', label: 'Role-based access control (Admin, Staff, Customer)' },
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
          <h2>Create Account</h2>
          <p>Register for a new account</p>

          {error && <div className="err-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="field-label">Account Role</label>
              <div className="inp-wrap">
                <select className="inp" name="role" value={formData.role} onChange={handleChange} required style={{ appearance: 'none' }}>
                  <option value="customer">Customer</option>
                  <option value="staff">Bank Staff</option>
                  <option value="admin">System Admin</option>
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--t-tertiary)' }}>
                  ▼
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">First Name</label>
                <div className="inp-wrap">
                  <input className="inp" name="first_name" type="text" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Last Name</label>
                <div className="inp-wrap">
                  <input className="inp" name="last_name" type="text" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Username</label>
              <div className="inp-wrap">
                <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input className="inp with-icon" name="username" type="text" placeholder="Choose a username" value={formData.username} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Email Address</label>
              <div className="inp-wrap">
                <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <input className="inp with-icon" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Password</label>
              <div className="inp-wrap">
                <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input className="inp with-icon" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <button className="btn-brand w-100 justify-content-center py-2" style={{ marginTop: 8, fontSize: '0.92rem' }} disabled={loading}>
              {loading ? <span className="spin" /> : <>
                Register Account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--t-tertiary)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--brand-light)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
