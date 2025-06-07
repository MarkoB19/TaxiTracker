import React from 'react';
import { useAppContext } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import TripCard from '../components/TripCard';
import ExpenseCard from '../components/ExpenseCard';
import DateSelector from '../components/DateSelector';
import { PlusIcon, CarFrontIcon, ReceiptIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { 
    trips, 
    expenses, 
    currentDate, 
    setCurrentDate, 
    getDailySummary,
    deleteTrip,
    deleteExpense
  } = useAppContext();

  const dailySummary = getDailySummary(currentDate);
  
  // Get trips and expenses for the selected date
  const dailyTrips = trips.filter(trip => trip.date === currentDate);
  const dailyExpenses = expenses.filter(expense => expense.date === currentDate);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Driver Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your trips and expenses
        </p>
      </header>
      
      <DateSelector
        date={currentDate}
        onDateChange={setCurrentDate}
      />
      
      <SummaryCard summary={dailySummary} showDate={false} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Today's Activity
        </h2>
        <div className="flex space-x-2">
          <Link
            to="/add-trip"
            className="flex items-center py-1 px-3 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={16} className="mr-1" />
            <CarFrontIcon size={16} />
          </Link>
          <Link
            to="/add-expense"
            className="flex items-center py-1 px-3 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <PlusIcon size={16} className="mr-1" />
            <ReceiptIcon size={16} />
          </Link>
        </div>
      </div>
      
      {dailyTrips.length === 0 && dailyExpenses.length === 0 ? (
        <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            No activity recorded for today
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              to="/add-trip"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add Trip
            </Link>
            <Link
              to="/add-expense"
              className="py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Add Expense
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {dailyTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={(trip) => console.log('Edit trip', trip)}
              onDelete={deleteTrip}
            />
          ))}
          
          {dailyExpenses.map(expense => (
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

export default Dashboard;