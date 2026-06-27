import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const TITLES = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/accounts': 'Accounts',
  '/transactions': 'Transactions',
  '/loans': 'Loans',
  '/cards': 'Cards',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

const Layout = () => {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'Dashboard';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        <Header title={title} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
