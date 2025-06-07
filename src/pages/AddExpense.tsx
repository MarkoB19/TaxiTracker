import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ExpenseCategory } from '../types';
import { ChevronLeftIcon } from 'lucide-react';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { addExpense, currentDate } = useAppContext();
  
  const [expenseData, setExpenseData] = useState({
    date: currentDate,
    amount: 0,
    category: 'fuel' as ExpenseCategory,
    description: '',
    receiptImage: ''
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
    addExpense(expenseData);
    navigate('/expenses');
  };
  
  const categories: ExpenseCategory[] = [
    'fuel',
    'maintenance',
    'insurance',
    'license',
    'cleaning',
    'parking',
    'tolls',
    'food',
    'other'
  ];

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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            name="amount"
            value={expenseData.amount || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setExpenseData(prev => ({ ...prev, category }))}
                className={`py-2 px-3 rounded-lg border text-center ${
                  expenseData.category === category
                    ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-xs font-medium capitalize">{category}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={expenseData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter expense details..."
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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