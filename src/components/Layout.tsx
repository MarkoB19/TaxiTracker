import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="pb-20">
        {children || <Outlet />}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;