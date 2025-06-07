import React from 'react';
import { DailySummary } from '../types';
import { formatCurrency, formatDistance, formatDate, getDayOfWeek } from '../utils/dateHelpers';
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon, CarIcon, Route } from 'lucide-react';

interface SummaryCardProps {
  summary: DailySummary;
  showDate?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, showDate = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      {showDate && (
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {formatDate(summary.date)}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {getDayOfWeek(summary.date)}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <ArrowUpIcon size={16} className="text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Income</span>
          </div>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <ArrowDownIcon size={16} className="text-red-500 mr-1" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Expenses</span>
          </div>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Net Profit</span>
          <span className={`text-lg font-bold ${
            summary.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(summary.netProfit)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="flex flex-col items-center">
          <Route size={16} className="text-blue-500 mb-1" />
          <span className="text-gray-500 dark:text-gray-400">Trips</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{summary.totalTrips}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <CarIcon size={16} className="text-blue-500 mb-1" />
          <span className="text-gray-500 dark:text-gray-400">Distance</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{formatDistance(summary.totalDistance)}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <DollarSignIcon size={16} className="text-blue-500 mb-1" />
          <span className="text-gray-500 dark:text-gray-400">Avg/Trip</span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {summary.totalTrips > 0 
              ? formatCurrency(summary.totalIncome / summary.totalTrips) 
              : formatCurrency(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;