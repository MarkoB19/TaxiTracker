import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  createDailySummary, 
  createWeeklySummary, 
  createMonthlySummary, 
  calculateFuelEfficiency,
  calculateExpenseCategoryBreakdown,
  calculatePaymentMethodBreakdown
} from '../utils/calculations';
import { formatCurrency, formatDistance, getWeekRange, getMonthYear } from '../utils/dateHelpers';
import { BarChart2Icon, CalendarIcon, TrendingUpIcon, BarChartIcon, PieChartIcon, CreditCardIcon } from 'lucide-react';

const Stats: React.FC = () => {
  const { trips, expenses, currentDate, settings } = useAppContext();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  
  const dailySummary = createDailySummary(trips, expenses, currentDate);
  const weeklySummary = createWeeklySummary(trips, expenses, currentDate);
  const monthlySummary = createMonthlySummary(trips, expenses, currentDate);
  
  const fuelExpenses = expenses.filter(expense => expense.category === 'fuel');
  const { efficiency, costPerDistance } = calculateFuelEfficiency(
    trips, 
    fuelExpenses, 
    settings.distanceUnit, 
    settings.volumeUnit
  );

  // Calculate expense breakdown
  const expenseBreakdown = calculateExpenseCategoryBreakdown(expenses);
  const paymentBreakdown = calculatePaymentMethodBreakdown(trips);

  const getEfficiencyLabel = () => {
    if (settings.distanceUnit === 'km' && settings.volumeUnit === 'L') {
      return 'L/100km';
    }
    if (settings.distanceUnit === 'mi' && settings.volumeUnit === 'gal') {
      return 'MPG';
    }
    return `${settings.volumeUnit}/${settings.distanceUnit}`;
  };

  const formatEfficiency = () => {
    if (efficiency === 0) return 'N/A';
    
    if (settings.distanceUnit === 'km' && settings.volumeUnit === 'L') {
      return `${efficiency.toFixed(1)} L/100km`;
    }
    if (settings.distanceUnit === 'mi' && settings.volumeUnit === 'gal') {
      return `${efficiency.toFixed(1)} MPG`;
    }
    return `${efficiency.toFixed(1)} ${settings.volumeUnit}/${settings.distanceUnit}`;
  };

  const formatCostPerDistance = () => {
    if (costPerDistance === 0) return 'N/A';
    const unit = settings.distanceUnit === 'km' ? 'km' : 'mile';
    return `${formatCurrency(costPerDistance, settings.currency)}/${unit}`;
  };

  const renderSummary = () => {
    if (viewMode === 'day') {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Daily Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Income</span>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(dailySummary.totalIncome, settings.currency)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Expenses</span>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(dailySummary.totalExpenses, settings.currency)}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Net Profit:</span>
            <span className={`font-bold ${
              dailySummary.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(dailySummary.netProfit, settings.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Total Trips:</span>
            <span className="font-bold text-gray-800 dark:text-white">{dailySummary.totalTrips}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Total Distance:</span>
            <span className="font-bold text-gray-800 dark:text-white">
              {formatDistance(dailySummary.totalDistance, settings.distanceUnit)}
            </span>
          </div>
        </div>
      );
    }
    
    if (viewMode === 'week') {
      const { start, end } = getWeekRange(currentDate);
      
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Weekly Summary
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Income</span>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(weeklySummary.totalIncome, settings.currency)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Expenses</span>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(weeklySummary.totalExpenses, settings.currency)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Net Profit:</span>
            <span className={`font-bold ${
              weeklySummary.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(weeklySummary.netProfit, settings.currency)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Total Trips:</span>
            <span className="font-bold text-gray-800 dark:text-white">{weeklySummary.totalTrips}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Total Distance:</span>
            <span className="font-bold text-gray-800 dark:text-white">
              {formatDistance(weeklySummary.totalDistance, settings.distanceUnit)}
            </span>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Daily Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-2 py-2">Day</th>
                  <th className="px-2 py-2">Income</th>
                  <th className="px-2 py-2">Expenses</th>
                  <th className="px-2 py-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {weeklySummary.dailySummaries.map((day) => (
                  <tr key={day.date} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="px-2 py-2">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                    <td className="px-2 py-2 text-green-600 dark:text-green-400">
                      {formatCurrency(day.totalIncome, settings.currency)}
                    </td>
                    <td className="px-2 py-2 text-red-600 dark:text-red-400">
                      {formatCurrency(day.totalExpenses, settings.currency)}
                    </td>
                    <td className={`px-2 py-2 ${
                      day.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(day.netProfit, settings.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (viewMode === 'month') {
      const { month, year } = getMonthYear(currentDate);
      
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Monthly Summary
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {month} {year}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Income</span>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(monthlySummary.totalIncome, settings.currency)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Expenses</span>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(monthlySummary.totalExpenses, settings.currency)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Net Profit:</span>
            <span className={`font-bold ${
              monthlySummary.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(monthlySummary.netProfit, settings.currency)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Total Trips:</span>
            <span className="font-bold text-gray-800 dark:text-white">{monthlySummary.totalTrips}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300">Total Distance:</span>
            <span className="font-bold text-gray-800 dark:text-white">
              {formatDistance(monthlySummary.totalDistance, settings.distanceUnit)}
            </span>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Weekly Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-2 py-2">Week</th>
                  <th className="px-2 py-2">Income</th>
                  <th className="px-2 py-2">Expenses</th>
                  <th className="px-2 py-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.weeklySummaries.map((week, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="px-2 py-2">Week {index + 1}</td>
                    <td className="px-2 py-2 text-green-600 dark:text-green-400">
                      {formatCurrency(week.totalIncome, settings.currency)}
                    </td>
                    <td className="px-2 py-2 text-red-600 dark:text-red-400">
                      {formatCurrency(week.totalExpenses, settings.currency)}
                    </td>
                    <td className={`px-2 py-2 ${
                      week.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(week.netProfit, settings.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review your financial performance
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 mb-4">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setViewMode('day')}
            className={`py-2 flex justify-center items-center rounded-lg transition-colors ${
              viewMode === 'day'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <CalendarIcon size={18} className="mr-1" />
            <span className="text-sm">Day</span>
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`py-2 flex justify-center items-center rounded-lg transition-colors ${
              viewMode === 'week'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChartIcon size={18} className="mr-1" />
            <span className="text-sm">Week</span>
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`py-2 flex justify-center items-center rounded-lg transition-colors ${
              viewMode === 'month'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart2Icon size={18} className="mr-1" />
            <span className="text-sm">Month</span>
          </button>
        </div>
      </div>
      
      {renderSummary()}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <TrendingUpIcon size={20} className="mr-1 text-blue-500" />
          Efficiency Metrics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-300">Fuel Efficiency</span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatEfficiency()}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Cost Per {settings.distanceUnit === 'km' ? 'Kilometer' : 'Mile'}
            </span>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCostPerDistance()}
            </p>
          </div>
        </div>
      </div>

      {/* Expense Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <PieChartIcon size={20} className="mr-1 text-purple-500" />
          Expense Categories
        </h3>
        <div className="space-y-3">
          {expenseBreakdown.map(({ category, amount, percentage }) => (
            <div key={category} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {category}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(amount, settings.currency)}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <CreditCardIcon size={20} className="mr-1 text-green-500" />
          Payment Methods
        </h3>
        <div className="space-y-3">
          {paymentBreakdown.map(({ method, amount, percentage, tripCount }) => (
            <div key={method} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {method} ({tripCount} trips)
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(amount, settings.currency)}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;