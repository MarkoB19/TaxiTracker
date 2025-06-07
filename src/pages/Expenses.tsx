import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ExpenseCard from '../components/ExpenseCard';
import DateSelector from '../components/DateSelector';
import { SearchIcon, FilterIcon, PlusIcon, ReceiptIcon } from 'lucide-react';
import { ExpenseCategory } from '../types';

const Expenses: React.FC = () => {
  const { expenses, currentDate, setCurrentDate, deleteExpense } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | null>(null);
  
  // Get expenses for the selected date and apply filters
  const filteredExpenses = expenses
    .filter(expense => expense.date === currentDate)
    .filter(expense => {
      if (searchQuery === '') return true;
      return (
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        expense.amount.toString().includes(searchQuery)
      );
    })
    .filter(expense => {
      if (!filterCategory) return true;
      return expense.category === filterCategory;
    });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Expenses
        </h1>
        <Link
          to="/add-expense"
          className="flex items-center py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <PlusIcon size={16} className="mr-1" />
          Add Expense
        </Link>
      </header>
      
      <DateSelector
        date={currentDate}
        onDateChange={setCurrentDate}
      />
      
      <div className="mb-4">
        <div className="relative">
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FilterIcon size={18} />
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`py-1 px-3 text-xs rounded-full ${
                  !filterCategory
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}
              >
                All
              </button>
              {['fuel', 'maintenance', 'insurance', 'license', 'cleaning', 'parking', 'tolls', 'food', 'other'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category as ExpenseCategory)}
                  className={`py-1 px-3 text-xs rounded-full ${
                    category === filterCategory
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <ReceiptIcon size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            No expenses found for this day
          </p>
          <Link
            to="/add-expense"
            className="mt-4 inline-block py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Add Your First Expense
          </Link>
        </div>
      ) : (
        <div>
          {filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={(expense) => console.log('Edit expense', expense)}
              onDelete={deleteExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;