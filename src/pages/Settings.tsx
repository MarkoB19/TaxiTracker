import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Currency, DistanceUnit } from '../types';
import { MoonIcon, SunIcon, HelpCircleIcon, ShieldIcon, DatabaseIcon, UserIcon, AlertTriangleIcon, CoinsIcon, RulerIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, clearData } = useAppContext();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  
  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'USD', label: 'US Dollar', symbol: '$' },
    { value: 'GBP', label: 'British Pound', symbol: '£' },
    { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
    { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
    { value: 'CHF', label: 'Swiss Franc', symbol: 'Fr.' },
    { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
    { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' }
  ];

  const distanceUnits: { value: DistanceUnit; label: string }[] = [
    { value: 'km', label: 'Kilometers' },
    { value: 'mi', label: 'Miles' }
  ];

  const handleExportData = () => {
    const trips = localStorage.getItem('taxiAppTrips');
    const expenses = localStorage.getItem('taxiAppExpenses');
    const data = {
      trips: trips ? JSON.parse(trips) : [],
      expenses: expenses ? JSON.parse(expenses) : [],
      settings
    };
    
    let exportData: string;
    let mimeType: string;
    let fileExtension: string;
    
    if (exportFormat === 'json') {
      exportData = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else {
      const tripRows = data.trips.map(trip => 
        `trip,${trip.date},${trip.startTime},${trip.endTime},${trip.fareAmount},${trip.tipAmount},${trip.distance},${trip.paymentMethod},${trip.notes}`
      );
      const expenseRows = data.expenses.map(expense =>
        `expense,${expense.date},${expense.amount},${expense.category},${expense.description}`
      );
      exportData = ['type,date,startTime,endTime,fareAmount,tipAmount,distance,paymentMethod,notes', ...tripRows, 
                    'type,date,amount,category,description', ...expenseRows].join('\n');
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }
    
    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxi-tracker-export.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data;
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
          localStorage.setItem('taxiAppTrips', JSON.stringify(data.trips));
          localStorage.setItem('taxiAppExpenses', JSON.stringify(data.expenses));
          if (data.settings) {
            updateSettings(data.settings);
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const trips: any[] = [];
          const expenses: any[] = [];
          
          lines.forEach(line => {
            const values = line.split(',');
            if (values[0] === 'trip') {
              trips.push({
                id: Date.now().toString() + Math.random(),
                date: values[1],
                startTime: values[2],
                endTime: values[3],
                fareAmount: parseFloat(values[4]),
                tipAmount: parseFloat(values[5]),
                distance: parseFloat(values[6]),
                paymentMethod: values[7],
                notes: values[8]
              });
            } else if (values[0] === 'expense') {
              expenses.push({
                id: Date.now().toString() + Math.random(),
                date: values[1],
                amount: parseFloat(values[2]),
                category: values[3],
                description: values[4]
              });
            }
          });
          
          localStorage.setItem('taxiAppTrips', JSON.stringify(trips));
          localStorage.setItem('taxiAppExpenses', JSON.stringify(expenses));
        }
        
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleClearData = () => {
    clearData();
    setShowConfirmClear(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your experience
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            {settings.darkMode ? <MoonIcon size={20} className="text-blue-500 mr-3" /> : <SunIcon size={20} className="text-amber-500 mr-3" />}
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.darkMode}
              onChange={() => updateSettings({ darkMode: !settings.darkMode })}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            <CoinsIcon size={20} className="text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-white">
              Currency
            </h3>
          </div>
          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value as Currency })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map(({ value, label, symbol }) => (
              <option key={value} value={value}>
                {symbol} {label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-3">
            <RulerIcon size={20} className="text-blue-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-800 dark:text-white">
              Distance Unit
            </h3>
          </div>
          <select
            value={settings.distanceUnit}
            onChange={(e) => updateSettings({ distanceUnit: e.target.value as DistanceUnit })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {distanceUnits.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <DatabaseIcon size={20} className="text-blue-500 mr-2" />
            Data Management
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Export Format:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setExportFormat('json')}
                  className={`px-3 py-1 text-xs rounded-full ${
                    exportFormat === 'json'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`px-3 py-1 text-xs rounded-full ${
                    exportFormat === 'csv'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  CSV
                </button>
              </div>
            </div>
            
            <button
              onClick={handleExportData}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Export Data
            </button>
            
            <label className="block">
              <span className="sr-only">Import Data</span>
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleImportData}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-gray-100 file:dark:bg-gray-700 file:text-gray-800 file:dark:text-white
                  hover:file:bg-gray-200 hover:file:dark:bg-gray-600
                  file:transition-colors cursor-pointer"
              />
            </label>
            
            <button
              onClick={() => setShowConfirmClear(true)}
              className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <ShieldIcon size={20} className="text-blue-500 mr-2" />
            Privacy & Security
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Your data is stored locally on your device. We recommend regularly exporting your data as backup.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <div className="flex items-start">
              <AlertTriangleIcon size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                Clearing browser data or cache will permanently delete your tracking history. Make sure to export your data regularly.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <HelpCircleIcon size={20} className="text-blue-500 mr-2" />
            Help & Support
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/faq')}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              FAQ
            </button>
            <a
              href="mailto:support@taxitracker.app"
              className="block w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
            >
              Contact Support
            </a>
          </div>
        </div>
        
        <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>TaxiTracker v1.0</p>
          <p>© 2025 TaxiTracker</p>
        </div>
      </div>
      
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Clear All Data?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This action cannot be undone. All your trips and expenses will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;