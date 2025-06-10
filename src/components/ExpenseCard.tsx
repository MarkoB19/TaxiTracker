import React, { useState } from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/dateHelpers';
import { useAppContext } from '../context/AppContext';
import { EditIcon, Trash2Icon, ReceiptIcon, TagIcon, XIcon, CheckIcon } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'fuel':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'maintenance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'insurance':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'license':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'cleaning':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
    case 'parking':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    case 'tolls':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    case 'food':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  const { settings, updateExpense } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState(expense);

  const handleSave = () => {
    updateExpense(editedExpense);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExpense(expense);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 border-red-500">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Expense</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
            >
              <CheckIcon size={20} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={editedExpense.amount}
              onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              step="0.01"
            />
          </div>

          {editedExpense.category === 'fuel' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Volume ({settings.volumeUnit})
              </label>
              <input
                type="number"
                value={editedExpense.volume || 0}
                onChange={(e) => setEditedExpense({ ...editedExpense, volume: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                step="0.1"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['fuel', 'maintenance', 'insurance', 'license', 'cleaning', 'parking', 'tolls', 'food', 'other'].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setEditedExpense({ ...editedExpense, category: category as Expense['category'] })}
                  className={`py-2 px-3 rounded-lg border text-center ${
                    editedExpense.category === category
                      ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-medium capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editedExpense.description}
              onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Receipt Image URL (optional)
            </label>
            <input
              type="url"
              value={editedExpense.receiptImage || ''}
              onChange={(e) => setEditedExpense({ ...editedExpense, receiptImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              placeholder="https://example.com/receipt.jpg"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 border-red-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <ReceiptIcon size={16} className="text-gray-500 mr-1" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Expense
          </span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <EditIcon size={16} />
          </button>
          <button 
            onClick={() => onDelete(expense.id)}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {formatCurrency(expense.amount, settings.currency)}
        </h3>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getCategoryColor(expense.category)}`}>
          <span className="font-medium capitalize">
            {expense.category}
          </span>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {expense.description && <p>{expense.description}</p>}
        {expense.category === 'fuel' && expense.volume && (
          <p className="mt-1 text-xs text-gray-500">
            Volume: {expense.volume} {settings.volumeUnit}
          </p>
        )}
      </div>
      
      {expense.receiptImage && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <a 
            href={expense.receiptImage}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center text-blue-500 hover:text-blue-700"
          >
            <TagIcon size={12} className="mr-1" />
            View Receipt
          </a>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;