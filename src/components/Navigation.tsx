import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, TruckIcon, ActivityIcon, SettingsIcon, Receipt } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', icon: <HomeIcon size={20} />, label: 'Home' },
    { path: '/trips', icon: <TruckIcon size={20} />, label: 'Trips' },
    { path: '/expenses', icon: <Receipt size={20} />, label: 'Expenses' },
    { path: '/stats', icon: <ActivityIcon size={20} />, label: 'Stats' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-3 px-5 transition-colors ${
              isActive(item.path)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
            }`}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;