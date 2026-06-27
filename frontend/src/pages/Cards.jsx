import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    account_id: '',
    card_type: 'credit',
    network: 'visa',
    credit_limit: '5000'
  });
  
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchCustomers();
    fetchAccounts();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await api.get('/cards/');
      setCards(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
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

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts/');
      setAccounts(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  const handleIssueCard = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        customer: parseInt(formData.customer_id),
        account: parseInt(formData.account_id),
        card_type: formData.card_type,
        network: formData.network,
        credit_limit: formData.card_type === 'credit' ? parseFloat(formData.credit_limit) : 0
      };
      await api.post('/cards/', payload);
      setIsModalOpen(false);
      setFormData({ customer_id: '', account_id: '', card_type: 'credit', network: 'visa', credit_limit: '5000' });
      fetchCards();
    } catch (err) {
      console.error('Failed to issue card:', err);
      alert('Failed to issue card. Check console for details.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCards = cards.filter(c => 
    c.card_number.includes(search) || 
    c.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="module-container">
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
            Card <span style={{ color: 'var(--brand)' }}>Management</span>
          </h1>
          <p style={{ color: 'var(--t-secondary)', fontSize: '1.1rem' }}>
            Issue and manage credit, debit, and prepaid cards.
          </p>
        </div>
        
        <button className="btn-brand" onClick={() => setIsModalOpen(true)} style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Issue Card
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
            placeholder="Search by card number or customer..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--t-tertiary)' }}>
          <span className="spin" style={{ width: 32, height: 32, borderTopColor: 'var(--brand)', marginBottom: 16 }} />
          <p>Loading card repository...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredCards.map(c => (
            <div key={c.id} style={{
              background: c.card_type === 'credit' ? 'linear-gradient(135deg, #09090b 0%, #1e1e24 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
              border: `1px solid ${c.card_type === 'credit' ? 'rgba(225,255,0,0.2)' : 'rgba(59,130,246,0.3)'}`,
              borderRadius: '24px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              transition: 'transform 0.3s'
            }}>
              {/* Glassmorphic overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', zIndex: 1 }} />
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
                      {c.card_type} CARD
                    </div>
                    <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>
                      {c.customer_name || 'Customer Name'}
                    </div>
                  </div>
                  <div style={{ 
                    fontStyle: 'italic', 
                    fontWeight: 800, 
                    fontSize: '1.4rem', 
                    color: c.card_type === 'credit' ? 'var(--brand)' : '#60a5fa' 
                  }}>
                    {c.network.toUpperCase()}
                  </div>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: '#fff', letterSpacing: 4, marginBottom: 24, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {c.masked_number || `**** **** **** ${c.card_number.slice(-4)}`}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 4 }}>VALID THRU</div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{new Date(c.expiry_date).toLocaleDateString('en-US', {month:'2-digit', year:'2-digit'})}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 4 }}>
                      {c.card_type === 'credit' ? 'CREDIT LIMIT' : 'BALANCE'}
                    </div>
                    <div style={{ color: c.card_type === 'credit' ? 'var(--brand)' : '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                      ${parseFloat(c.card_type === 'credit' ? c.credit_limit : c.current_balance).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCards.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--t-tertiary)', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
              No cards found. Issue a new card to get started.
            </div>
          )}
        </div>
      )}

      {/* SLIDE-IN MODAL FOR NEW CARD */}
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Issue New Card</h2>
            <button className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ padding: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleIssueCard}>
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

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Linked Account</label>
              <div className="inp-wrap">
                <select className="inp" style={{ appearance: 'none' }} value={formData.account_id} onChange={e => setFormData({...formData, account_id: e.target.value})} required>
                  <option value="" disabled>Select Linked Account...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.account_number} (Balance: ${acc.balance})</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Card Type</label>
                <div className="inp-wrap">
                  <select className="inp" style={{ appearance: 'none' }} value={formData.card_type} onChange={e => setFormData({...formData, card_type: e.target.value})} required>
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                    <option value="prepaid">Prepaid Card</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Network</label>
                <div className="inp-wrap">
                  <select className="inp" style={{ appearance: 'none' }} value={formData.network} onChange={e => setFormData({...formData, network: e.target.value})} required>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">Amex</option>
                    <option value="rupay">RuPay</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>
            </div>

            {formData.card_type === 'credit' && (
              <div className="form-group" style={{ marginBottom: 40 }}>
                <label className="field-label">Credit Limit ($)</label>
                <div className="inp-wrap">
                  <input className="inp" type="number" step="100" min="500" value={formData.credit_limit} onChange={e => setFormData({...formData, credit_limit: e.target.value})} required />
                </div>
              </div>
            )}

            <button type="submit" className="btn-brand w-100 justify-content-center py-2" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px', marginTop: formData.card_type !== 'credit' ? 40 : 0 }} disabled={modalLoading}>
              {modalLoading ? <span className="spin" /> : 'Issue Card'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cards;
