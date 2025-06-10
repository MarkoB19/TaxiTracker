import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getCurrentDateString } from '../utils/dateHelpers';
import { ChevronLeftIcon, DollarSignIcon, TagIcon, FileTextIcon, DropletIcon } from 'lucide-react';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { addExpense, currentDate, settings } = useAppContext();
  
  const [expenseData, setExpenseData] = useState({
    date: currentDate,
    amount: 0,
    category: '' as 'fuel' | 'maintenance' | 'insurance' | 'license' | 'cleaning' | 'parking' | 'tolls' | 'food' | 'other',
    description: '',
    receiptImage: '',
    volume: 0
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setExpenseData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseData.amount || !expenseData.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    const expense = {
      date: expenseData.date,
      amount: expenseData.amount,
      category: expenseData.category,
      description: expenseData.description,
      receiptImage: expenseData.receiptImage || undefined,
      volume: expenseData.category === 'fuel' && expenseData.volume > 0 ? expenseData.volume : undefined
    };
    
    addExpense(expense);
    navigate('/expenses');
  };
  
  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AUD: 'A$',
      CAD: 'C$',
      CHF: 'Fr.',
      JPY: '¥',
      CNY: '¥'
    };
    return symbols[settings.currency] || '€';
  };
  
  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Expense
        </h1>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={expenseData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <DollarSignIcon size={16} className="inline mr-1" />
            Amount ({getCurrencySymbol()}) *
          </label>
          <input
            type="number"
            name="amount"
            value={expenseData.amount || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <TagIcon size={16} className="inline mr-1" />
            Category *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'fuel', label: 'Fuel', emoji: '⛽' },
              { value: 'maintenance', label: 'Maintenance', emoji: '🔧' },
              { value: 'insurance', label: 'Insurance', emoji: '📝' },
              { value: 'license', label: 'License', emoji: '🪪' },
              { value: 'cleaning', label: 'Cleaning', emoji: '🧽' },
              { value: 'parking', label: 'Parking', emoji: '🅿️' },
              { value: 'tolls', label: 'Tolls', emoji: '🛣️' },
              { value: 'food', label: 'Food', emoji: '🍔' },
              { value: 'other', label: 'Other', emoji: '📋' }
            ].map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setExpenseData(prev => ({ ...prev, category: category.value as any }))}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border ${
                  expenseData.category === category.value
                    ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg mb-1">{category.emoji}</span>
                <span className="text-xs font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {expenseData.category === 'fuel' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <DropletIcon size={16} className="inline mr-1" />
              Volume ({settings.volumeUnit})
            </label>
            <input
              type="number"
              name="volume"
              value={expenseData.volume || ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={`Enter volume in ${settings.volumeUnit}`}
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FileTextIcon size={16} className="inline mr-1" />
            Description *
          </label>
          <textarea
            name="description"
            value={expenseData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Describe the expense..."
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Receipt Image URL (optional)
          </label>
          <input
            type="url"
            name="receiptImage"
            value={expenseData.receiptImage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="https://example.com/receipt.jpg"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-2 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;