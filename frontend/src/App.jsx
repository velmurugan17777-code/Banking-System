import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Loans from './pages/Loans';

const Placeholder = ({ title }) => (
  <div className="glass" style={{padding: '60px 32px', textAlign: 'center'}}>
    <div style={{
      width: 64, height: 64,
      background: 'rgba(79,124,247,0.1)',
      borderRadius: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 20px',
      border: '1px solid rgba(79,124,247,0.2)',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    </div>
    <h2 style={{fontSize:'1.3rem', fontWeight:700, color:'var(--text)', marginBottom: 8}}>{title}</h2>
    <p style={{color:'var(--text-muted)', maxWidth:400, margin:'0 auto'}}>
      This module is under active development. Full CRUD functionality coming soon.
    </p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers"    element={<Customers />} />
          <Route path="/accounts"     element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/cards"        element={<Cards />} />
          <Route path="/loans"        element={<Loans />} />
          <Route path="/analytics"    element={<Placeholder title="Analytics & Reports" />} />
          <Route path="/settings"     element={<Placeholder title="System Settings" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
