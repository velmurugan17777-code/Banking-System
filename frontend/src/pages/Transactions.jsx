import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    account_id: '',
    transaction_type: 'credit',
    amount: '',
    category: 'transfer',
    description: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/');
      setTransactions(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
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

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      // Find account object by ID (if needed by backend, though DRF expects PK)
      const payload = {
        account: parseInt(formData.account_id),
        transaction_type: formData.transaction_type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description
      };
      await api.post('/transactions/', payload);
      setIsModalOpen(false);
      setFormData({ account_id: '', transaction_type: 'credit', amount: '', category: 'transfer', description: '' });
      fetchTransactions(); // Refresh the ledger
    } catch (err) {
      console.error('Failed to create transaction:', err);
      alert('Failed to log transaction. Check console for details.');
    } finally {
      setModalLoading(false);
    }
  };

  // Filter and Search Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.reference_number.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.transaction_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="module-container">
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
            Transaction <span style={{ color: 'var(--brand)' }}>Ledger</span>
          </h1>
          <p style={{ color: 'var(--t-secondary)', fontSize: '1.1rem' }}>
            Monitor and record global financial activities in real-time.
          </p>
        </div>
        
        <button className="btn-brand" onClick={() => setIsModalOpen(true)} style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Transaction
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <div className="inp-wrap" style={{ flex: 1, margin: 0 }}>
          <svg className="inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            className="inp with-icon" 
            style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            placeholder="Search by reference number or description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="inp-wrap" style={{ width: '200px', margin: 0 }}>
          <select 
            className="inp" 
            style={{ appearance: 'none', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="credit">Credits (Inbound)</option>
            <option value="debit">Debits (Outbound)</option>
            <option value="transfer">Transfers</option>
          </select>
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--t-tertiary)' }}>▼</div>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="card">
        <div className="card-header" style={{ padding: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Recent Activity</h3>
        </div>
        
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--t-tertiary)' }}>
            <span className="spin" style={{ width: 32, height: 32, borderTopColor: 'var(--brand)', marginBottom: 16 }} />
            <p>Syncing ledger...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Reference</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--t-tertiary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--t-primary)' }}>{t.reference_number}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                        background: t.transaction_type === 'credit' ? 'rgba(225,255,0,0.1)' : t.transaction_type === 'debit' ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)',
                        color: t.transaction_type === 'credit' ? '#e1ff00' : t.transaction_type === 'debit' ? '#a855f7' : '#3b82f6',
                        border: `1px solid ${t.transaction_type === 'credit' ? 'rgba(225,255,0,0.2)' : t.transaction_type === 'debit' ? 'rgba(168,85,247,0.2)' : 'rgba(59,130,246,0.2)'}`
                      }}>
                        {t.transaction_type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--t-secondary)', textTransform: 'capitalize' }}>{t.category.replace('_', ' ')}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--t-secondary)' }}>{t.description || '—'}</td>
                    <td style={{ 
                      padding: '16px 24px', 
                      textAlign: 'right', 
                      fontWeight: 700, 
                      fontSize: '1.1rem',
                      color: t.transaction_type === 'credit' ? '#e1ff00' : 'var(--t-primary)' 
                    }}>
                      {t.transaction_type === 'credit' ? '+' : '-'}${parseFloat(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.status === 'completed' ? '#4ade80' : t.status === 'pending' ? '#f59e0b' : '#ef4444', boxShadow: `0 0 10px ${t.status === 'completed' ? '#4ade80' : t.status === 'pending' ? '#f59e0b' : '#ef4444'}` }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--t-secondary)', textTransform: 'capitalize' }}>{t.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--t-tertiary)' }}>
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SLIDE-IN MODAL FOR NEW TRANSACTION */}
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Log Transaction</h2>
            <button className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ padding: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleCreateTransaction}>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Target Account</label>
              <div className="inp-wrap">
                <select className="inp" style={{ appearance: 'none' }} value={formData.account_id} onChange={e => setFormData({...formData, account_id: e.target.value})} required>
                  <option value="" disabled>Select an account...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_number} - {acc.customer_name} (Balance: ${acc.balance})
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Transaction Type</label>
                <div className="inp-wrap">
                  <select className="inp" style={{ appearance: 'none' }} value={formData.transaction_type} onChange={e => setFormData({...formData, transaction_type: e.target.value})} required>
                    <option value="credit">Credit (Deposit)</option>
                    <option value="debit">Debit (Withdrawal)</option>
                    <option value="transfer">Transfer</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="field-label">Amount ($)</label>
                <div className="inp-wrap">
                  <input className="inp" type="number" step="0.01" min="0" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="field-label">Category</label>
              <div className="inp-wrap">
                <select className="inp" style={{ appearance: 'none' }} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                  <option value="salary">Salary</option>
                  <option value="utilities">Utilities</option>
                  <option value="shopping">Shopping</option>
                  <option value="transfer">Transfer</option>
                  <option value="fee">Bank Fee</option>
                  <option value="other">Other</option>
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 40 }}>
              <label className="field-label">Description / Memo</label>
              <textarea 
                className="inp" 
                rows="3" 
                placeholder="Brief description of the transaction..."
                style={{ resize: 'none', padding: '16px' }}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button type="submit" className="btn-brand w-100 justify-content-center py-2" style={{ padding: '16px', fontSize: '1.05rem', borderRadius: '16px' }} disabled={modalLoading}>
              {modalLoading ? <span className="spin" /> : 'Log Transaction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
