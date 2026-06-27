import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_type: 'national_id',
    id_number: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    api.get(`/customers/?search=${search}`)
      .then(res => setCustomers(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await api.post('/customers/', formData);
      setIsModalOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', id_type: 'national_id', id_number: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Failed to create customer:', err);
      alert('Failed to add customer. Check console for details.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="module-container">
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
            Customer <span style={{ color: 'var(--brand)' }}>Directory</span>
          </h1>
          <p style={{ color: 'var(--t-secondary)', fontSize: '1.1rem' }}>
            Manage your bank's clients and their KYC status.
          </p>
        </div>
        
        <button className="btn-brand" onClick={() => setIsModalOpen(true)} style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Customer
        </button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="inp-wrap" style={{ width: 280, margin: 0 }}>
            <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              className="inp with-icon" 
              placeholder="Search by name, email, or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="inp-wrap" style={{ width: 160, margin: 0 }}>
            <select className="inp" style={{ appearance: 'none' }}>
              <option value="">All KYC Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--t-tertiary)' }}>▼</div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>KYC Status</th>
                <th>Joined</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px 0' }}>
                    <span className="spin" style={{ borderColor: 'rgba(59,130,246,0.2)', borderTopColor: 'var(--brand)' }}></span>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div className="empty-title">No customers found</div>
                      <div className="empty-sub">Adjust your search or add a new customer.</div>
                    </div>
                  </td>
                </tr>
              ) : customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="av av-md" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-2))' }}>
                        {c.first_name[0]}{c.last_name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{c.first_name} {c.last_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--t-tertiary)' }}>ID: {c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{c.email}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--t-secondary)' }}>{c.phone}</div>
                  </td>
                  <td>
                    {c.kyc_verified ? 
                      <span className="pill pill-green"><span className="pill-dot"/> Verified</span> : 
                      <span className="pill pill-amber"><span className="pill-dot"/> Pending</span>
                    }
                  </td>
                  <td style={{ color: 'var(--t-secondary)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" title="View Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-IN MODAL FOR NEW CUSTOMER */}
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Add Customer</h2>
            <button className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ padding: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleCreateCustomer}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">First Name</label>
                <div className="inp-wrap">
                  <input className="inp" type="text" placeholder="First Name" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Last Name</label>
                <div className="inp-wrap">
                  <input className="inp" type="text" placeholder="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Email Address</label>
              <div className="inp-wrap">
                <input className="inp" type="email" placeholder="customer@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Phone Number</label>
              <div className="inp-wrap">
                <input className="inp" type="text" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">ID Type</label>
                <div className="inp-wrap">
                  <select className="inp" style={{ appearance: 'none' }} value={formData.id_type} onChange={e => setFormData({...formData, id_type: e.target.value})} required>
                    <option value="national_id">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="voter_id">Voter ID</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="field-label">ID Number</label>
                <div className="inp-wrap">
                  <input className="inp" type="text" placeholder="ID Number" value={formData.id_number} onChange={e => setFormData({...formData, id_number: e.target.value})} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-brand w-100 justify-content-center py-2" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px' }} disabled={modalLoading}>
              {modalLoading ? <span className="spin" /> : 'Create Customer Record'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Customers;
