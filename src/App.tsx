import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import AddTrip from './pages/AddTrip';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem('taxiAppDarkMode') === 'true';
    document.documentElement.classList.toggle('dark', isDarkMode);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="trips" element={<Trips />} />
              <Route path="add-trip" element={<AddTrip />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="add-expense" element={<AddExpense />} />
              <Route path="stats" element={<Stats />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </>
  );
}

export default App;