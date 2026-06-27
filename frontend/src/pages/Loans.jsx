import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_type: 'personal',
    amount: '',
    interest_rate: '',
    tenure_months: '',
    collateral_type: 'none'
  });
  
  const [customers, setCustomers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchCustomers();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans/');
      setLoans(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers/');
      setCustomers(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        customer: parseInt(formData.customer_id),
        loan_type: formData.loan_type,
        amount: parseFloat(formData.amount),
        interest_rate: parseFloat(formData.interest_rate),
        tenure_months: parseInt(formData.tenure_months),
        collateral_type: formData.collateral_type
      };
      await api.post('/loans/', payload);
      setIsModalOpen(false);
      setFormData({ customer_id: '', loan_type: 'personal', amount: '', interest_rate: '', tenure_months: '', collateral_type: 'none' });
      fetchLoans();
    } catch (err) {
      console.error('Failed to originate loan:', err);
      alert('Failed to originate loan. Check console for details.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredLoans = loans.filter(l => 
    l.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.loan_type.includes(search)
  );

  return (
    <div className="module-container">
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
            Loan <span style={{ color: 'var(--brand)' }}>Origination</span>
          </h1>
          <p style={{ color: 'var(--t-secondary)', fontSize: '1.1rem' }}>
            Manage credit applications and track active loans.
          </p>
        </div>
        
        <button className="btn-brand" onClick={() => setIsModalOpen(true)} style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Originate Loan
        </button>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <div className="inp-wrap" style={{ flex: 1, margin: 0 }}>
          <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            className="inp with-icon" 
            style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            placeholder="Search by customer name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ padding: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Active Credit Portfolio</h3>
        </div>
        
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--t-tertiary)' }}>
            <span className="spin" style={{ width: 32, height: 32, borderTopColor: 'var(--brand)', marginBottom: 16 }} />
            <p>Loading loan portfolio...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Loan Details</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Principal</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>EMI</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Outstanding</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--t-primary)' }}>{l.customer_name || 'Customer Name'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ color: 'var(--t-primary)', textTransform: 'capitalize', fontWeight: 600 }}>{l.loan_type}</div>
                      <div style={{ color: 'var(--t-secondary)', fontSize: '0.8rem' }}>{l.interest_rate}% APR • {l.tenure_months} mo</div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', color: '#fff' }}>
                      ${parseFloat(l.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--t-secondary)' }}>
                      ${parseFloat(l.emi_amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--brand)', fontWeight: 700 }}>
                      ${parseFloat(l.outstanding_amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.status === 'approved' ? '#4ade80' : l.status === 'applied' ? '#f59e0b' : '#3b82f6', boxShadow: `0 0 10px ${l.status === 'approved' ? '#4ade80' : l.status === 'applied' ? '#f59e0b' : '#3b82f6'}` }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--t-secondary)', textTransform: 'capitalize' }}>{l.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--t-tertiary)' }}>
                      No loans found in the portfolio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SLIDE-IN MODAL FOR LOAN ORIGINATION */}
      <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        zIndex: 1000,
        opacity: isModalOpen ? 1 : 0,
        visibility: isModalOpen ? 'visible' : 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', justifyContent: 'flex-end'
      }} onClick={() => setIsModalOpen(false)}>
        
        <div className="modal-panel" style={{
          width: '100%', maxWidth: '500px', height: '100%',
          background: 'rgba(15, 15, 18, 0.95)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          padding: '40px',
          transform: isModalOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto'
        }} onClick={e => e.stopPropagation()}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Originate Loan</h2>
            <button className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ padding: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleApplyLoan}>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Customer</label>
              <div className="inp-wrap">
                <select className="inp" style={{ appearance: 'none' }} value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} required>
                  <option value="" disabled>Select Customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Loan Type</label>
                <div className="inp-wrap">
                  <select className="inp" style={{ appearance: 'none' }} value={formData.loan_type} onChange={e => setFormData({...formData, loan_type: e.target.value})} required>
                    <option value="personal">Personal Loan</option>
                    <option value="home">Home Loan</option>
                    <option value="auto">Auto Loan</option>
                    <option value="business">Business Loan</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Collateral</label>
                <div className="inp-wrap">
                  <select className="inp" style={{ appearance: 'none' }} value={formData.collateral_type} onChange={e => setFormData({...formData, collateral_type: e.target.value})} required>
                    <option value="none">None (Unsecured)</option>
                    <option value="property">Property</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Principal Amount ($)</label>
              <div className="inp-wrap">
                <input className="inp" type="number" step="1000" min="1000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="e.g. 50000" required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Interest Rate (APR %)</label>
                <div className="inp-wrap">
                  <input className="inp" type="number" step="0.1" min="1" max="40" value={formData.interest_rate} onChange={e => setFormData({...formData, interest_rate: e.target.value})} placeholder="e.g. 5.5" required />
                </div>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Tenure (Months)</label>
                <div className="inp-wrap">
                  <input className="inp" type="number" min="6" max="360" value={formData.tenure_months} onChange={e => setFormData({...formData, tenure_months: e.target.value})} placeholder="e.g. 36" required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-brand w-100 justify-content-center py-2" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px' }} disabled={modalLoading}>
              {modalLoading ? <span className="spin" /> : 'Originate Loan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Loans;
