import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend, ArcElement, BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend, ArcElement, BarElement
);

/* ---------- helpers ---------- */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

const fmtFull = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const monthLabel = (str) =>
  new Date(str).toLocaleDateString('default', { month: 'short' });

/* ---------- chart defaults ---------- */
const tooltip = {
  backgroundColor: '#0d1526',
  titleColor: '#e2e8f0',
  bodyColor: '#94a3b8',
  borderColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 8,
};

/* ---------- sub-components ---------- */
const StatCard = ({ label, value, sub, ico, color, change }) => (
  <div className={`stat ${color}`}>
    <div className="stat-row">
      <div className={`stat-icon ${color}`}>{ico}</div>
      {change !== undefined && (
        <span className={`stat-delta ${change >= 0 ? 'up' : 'down'}`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-hint">{sub}</div>
  </div>
);

const QaBtn = ({ label, color, ico }) => (
  <button className="qa-btn">
    <span style={{ color }}>{ico}</span>
    <span style={{flex:1}}>{label}</span>
    <span className="qa-arrow">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </span>
  </button>
);

/* ============================================================
   DASHBOARD
   ============================================================ */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard/')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spin" style={{ width: 44, height: 44, borderWidth: 4 }} />
      </div>
    );
  }

  /* ---- chart data ---- */
  const months = data.monthly_revenue.map(m => monthLabel(m.month));

  const lineData = {
    labels: months,
    datasets: [{
      label: 'Transaction Volume',
      data: data.monthly_revenue.map(m => m.volume),
      borderColor: '#e1ff00',
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        g.addColorStop(0, 'rgba(225, 255, 0, 0.4)');
        g.addColorStop(1, 'rgba(225, 255, 0, 0)');
        return g;
      },
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#09090b',
      pointBorderColor: '#e1ff00',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }],
  };

  const barData = {
    labels: months,
    datasets: [{
      label: 'Transactions',
      data: data.monthly_revenue.map(m => m.count || Math.round(m.volume / 2500)),
      backgroundColor: '#a855f7',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const donutData = {
    labels: data.accounts.distribution.map(d =>
      d.account_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
    datasets: [{
      data: data.accounts.distribution.map(d => d.count),
      backgroundColor: ['#e1ff00', '#a855f7', '#4ade80', '#ec4899', '#00b8d9'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#4a5568', font: { size: 11 } }, border: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a5568', font: { size: 11 }, callback: v => '$' + (v/1000).toFixed(0) + 'k' }, border: { display: false } },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#4a5568', font: { size: 11 } }, border: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a5568', font: { size: 11 } }, border: { display: false } },
    },
  };

  const donutOpts = {
    cutout: '72%', responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#718096', padding: 18, font: { size: 11 } } },
      tooltip,
    },
  };

  /* ---- txn type helpers ---- */
  const txnIco = (type) => {
    if (type === 'credit') return { cls: 'in', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg> };
    if (type === 'debit')  return { cls: 'out', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg> };
    return { cls: 'tr', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> };
  };

  const statusPill = (s) => {
    const m = { completed: 'green', pending: 'amber', failed: 'red' };
    return <span className={`pill pill-${m[s] || 'blue'}`}>{s}</span>;
  };

  return (
    <div>

      {/* ---- KPI CARDS ---- */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard
            label="Total Customers" value={data.customers.total.toLocaleString()}
            sub={`+${data.customers.new_30d} new this month`}
            color="blue" change={12}
            ico={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            label="Total Deposits" value={fmt(data.accounts.total_deposits)}
            sub={`${data.accounts.active} active accounts`}
            color="green" change={8}
            ico={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            label="Transaction Volume (30d)" value={fmt(data.transactions.volume_30d)}
            sub={`${data.transactions.recent_count} transactions`}
            color="amber" change={-3}
            ico={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
          />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard
            label="Active Loans" value={fmt(data.loans.total_amount)}
            sub={`${data.loans.pending_approvals} pending approvals`}
            color="pink" change={5}
            ico={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </div>
      </div>

      {/* ---- CHARTS ROW ---- */}
      <div className="row g-3 mb-4">
        {/* Line chart */}
        <div className="col-12 col-xl-5">
          <div className="card" style={{height:'100%'}}>
            <div className="card-header">
              <span className="card-title">Transaction Volume</span>
              <select className="inp">
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="card-body">
              <div className="chart-box">
                <Line data={lineData} options={lineOpts} />
              </div>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="col-12 col-lg-7 col-xl-4">
          <div className="card" style={{height:'100%'}}>
            <div className="card-header">
              <span className="card-title">Monthly Transactions</span>
            </div>
            <div className="card-body">
              <div className="chart-box">
                <Bar data={barData} options={barOpts} />
              </div>
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="col-12 col-lg-5 col-xl-3">
          <div className="card" style={{height:'100%'}}>
            <div className="card-header">
              <span className="card-title">Account Types</span>
            </div>
            <div className="card-body">
              <div className="chart-box" style={{height:240}}>
                <Doughnut data={donutData} options={donutOpts} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- BOTTOM ROW ---- */}
      <div className="row g-3">

        {/* Recent Transactions Table */}
        <div className="col-12 col-xl-8">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Transactions</span>
              <button className="btn-ghost">
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.recent.map(txn => {
                    const { cls, svg } = txnIco(txn.transaction_type);
                    return (
                      <tr key={txn.id}>
                        <td>
                          <div style={{display:'flex', alignItems:'center', gap:10}}>
                            <div className={`txn-ico ${cls}`}>{svg}</div>
                            <div>
                              <div style={{fontWeight:600, textTransform:'capitalize'}}>{txn.transaction_type}</div>
                              <div style={{fontSize:'0.74rem', color:'var(--text-dim)'}}>{txn.reference_number}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{fontWeight:500}}>{txn.account__customer__first_name} {txn.account__customer__last_name}</div>
                          <div style={{fontSize:'0.74rem', color:'var(--text-dim)'}}>{txn.account__account_number}</div>
                        </td>
                        <td style={{color:'var(--text-muted)'}}>
                          {new Date(txn.created_at).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}
                        </td>
                        <td>
                          <span style={{
                            fontWeight: 700,
                            color: txn.transaction_type === 'credit' ? 'var(--green)' : txn.transaction_type === 'debit' ? 'var(--red)' : 'var(--accent)',
                          }}>
                            {txn.transaction_type === 'credit' ? '+' : '-'}{fmtFull(txn.amount)}
                          </span>
                        </td>
                        <td>{statusPill(txn.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-3">

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Quick Actions</span>
            </div>
            <div className="glass-pad d-flex flex-column gap-2">
              <QaBtn label="Onboard New Customer" color="var(--accent)"
                ico={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
              />
              <QaBtn label="Open New Account" color="var(--green)"
                ico={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
              />
              <QaBtn label="Process Transfer" color="var(--amber)"
                ico={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
              />
              <QaBtn label="Review Loan Applications" color="#ec4899"
                ico={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              />
              <QaBtn label="Issue New Card" color="var(--cyan)"
                ico={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
              />
            </div>
          </div>

          {/* Loan Portfolio */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Loan Portfolio</span>
            </div>
            <div className="card-body">
              {[
                { label: 'Personal Loans', pct: 45, color: 'var(--accent)' },
                { label: 'Home Loans', pct: 30, color: 'var(--green)' },
                { label: 'Business Loans', pct: 18, color: 'var(--amber)' },
                { label: 'Auto Loans', pct: 7, color: '#ec4899' },
              ].map(item => (
                <div className="prog-wrap" key={item.label}>
                  <div className="prog-top">
                    <span style={{color:'var(--text-muted)'}}>{item.label}</span>
                    <span style={{color:'var(--text)', fontWeight:600}}>{item.pct}%</span>
                  </div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{width:`${item.pct}%`, background: item.color}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
