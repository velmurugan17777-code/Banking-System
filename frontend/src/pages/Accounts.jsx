import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Interactive dynamic styles for the module
const styles = `
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 3D Flip Card */
.bank-card-wrap {
  perspective: 1000px;
  width: 100%;
  height: 210px;
  cursor: pointer;
}

.bank-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: left;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.bank-card-wrap:hover .bank-card-inner {
  transform: rotateY(180deg);
}

.bank-card-front, .bank-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.bank-card-front::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* Background Gradients */
.bc-savings { background: linear-gradient(135deg, #1e3a8a, #3b82f6); }
.bc-checking { background: linear-gradient(135deg, #064e3b, #10b981); }
.bc-credit { background: linear-gradient(135deg, #78350f, #f59e0b); }
.bc-business { background: linear-gradient(135deg, #4c1d95, #8b5cf6); }

.bc-chip {
  width: 44px; height: 32px;
  background: linear-gradient(135deg, #fcd34d, #b45309);
  border-radius: 6px;
  opacity: 0.95;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.3);
  position: relative;
}
.bc-chip::after {
  content: '';
  position: absolute;
  top: 50%; left: 0; width: 100%; height: 1px;
  background: rgba(0,0,0,0.2);
}

.bc-type {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.bc-number {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  margin-top: auto;
  margin-bottom: 16px;
  color: #fff;
}

.bc-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.bc-label { font-size: 0.65rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;}
.bc-val { font-size: 1.05rem; font-weight: 700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

/* Back of card */
.bank-card-back {
  background: var(--bg-card);
  transform: rotateY(180deg);
  border: 1px solid var(--border-md);
  align-items: center;
  justify-content: center;
}

.bc-magstripe {
  position: absolute;
  top: 24px; left: 0; width: 100%; height: 40px;
  background: #000;
  opacity: 0.8;
}

.bc-cvv-strip {
  position: absolute;
  top: 80px; left: 24px; right: 24px; height: 32px;
  background: #fff;
  display: flex; align-items: center; justify-content: flex-end;
  padding-right: 12px;
  color: #000;
  font-family: monospace;
  font-weight: bold;
  font-size: 1.1rem;
}

.action-btn-group {
  position: absolute;
  bottom: 24px; left: 24px; right: 24px;
  display: flex; gap: 8px;
}

/* Modals & Overlays */
.overlay-panel {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const getCardClass = (type) => {
  if (type.includes('savings')) return 'bc-savings';
  if (type.includes('checking')) return 'bc-checking';
  if (type.includes('credit')) return 'bc-credit';
  if (type.includes('business')) return 'bc-business';
  return 'bc-savings';
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAccType, setNewAccType] = useState('checking');

  useEffect(() => {
    // We will use the /accounts endpoint if it exists. 
    // In our backend, we have customer and account models.
    api.get('/accounts/')
      .then(res => setAccounts(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    // Simulate creating account for demo dynamism
    const fakeAcc = {
      id: Math.random(),
      account_number: '9' + Math.floor(Math.random() * 1000000000),
      account_type: newAccType,
      balance: '0.00',
      status: 'active',
      customer: 1 // Default link for demo
    };
    setAccounts([fakeAcc, ...accounts]);
    setShowModal(false);
  };

  return (
    <div>
      <style>{styles}</style>
      
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="ph-title">Account Management</h1>
          <p className="ph-sub">Interactive overview of active portfolios and balances.</p>
        </div>
        <button className="btn-brand" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Open New Account
        </button>
      </div>

      {loading ? (
        <div className="page-loader"><span className="spin" /></div>
      ) : (
        <>
          <div className="accounts-grid">
            {accounts.map(acc => (
              <div className="bank-card-wrap overlay-panel" key={acc.id}>
                <div className="bank-card-inner">
                  
                  {/* Front of Card */}
                  <div className={`bank-card-front ${getCardClass(acc.account_type.toLowerCase())}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="bc-chip"></div>
                      <div className="bc-type">{acc.account_type.replace('_', ' ')}</div>
                    </div>
                    
                    <div className="bc-number">
                      {acc.account_number.match(/.{1,4}/g)?.join(' ') || acc.account_number}
                    </div>
                    
                    <div className="bc-bottom">
                      <div>
                        <div className="bc-label">Available Balance</div>
                        <div className="bc-val">{fmt(parseFloat(acc.balance))}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="bc-label">Status</div>
                        <div className="bc-val" style={{ color: acc.status === 'active' ? '#34d399' : '#f87171' }}>
                          {acc.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of Card (Interactive Actions) */}
                  <div className="bank-card-back">
                    <div className="bc-magstripe"></div>
                    <div className="bc-cvv-strip">***</div>
                    
                    <div className="action-btn-group">
                      <button className="btn-brand" style={{ flex: 1, padding: '6px' }}>View Statement</button>
                      <button className="btn-outline" style={{ flex: 1, padding: '6px' }}>Freeze</button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
          
          {accounts.length === 0 && (
             <div className="empty-state card" style={{ padding: '60px 20px' }}>
               <div className="empty-title">No Accounts Found</div>
               <div className="empty-sub">This customer doesn't have any active accounts.</div>
             </div>
          )}
        </>
      )}

      {/* Modern Glass Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">Open New Account</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <form id="acc-form" onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="field-label">Account Type</label>
                  <select className="inp" value={newAccType} onChange={e => setNewAccType(e.target.value)} required>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="business">Business Account</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="field-label">Link to Customer ID</label>
                  <input className="inp" type="number" placeholder="e.g. 1" required />
                  <div className="field-hint">The customer must already be KYC verified.</div>
                </div>
              </form>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-brand" form="acc-form" type="submit">Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
