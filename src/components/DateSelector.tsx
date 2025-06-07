import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';

interface DateSelectorProps {
  date: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ date, onDateChange }) => {
  const handlePreviousDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    onDateChange(currentDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    onDateChange(currentDate.toISOString().split('T')[0]);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-2 mb-4">
      <button
        onClick={handlePreviousDay}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronLeftIcon size={20} />
      </button>
      
      <div className="relative flex items-center">
        <CalendarIcon size={16} className="absolute left-2 text-gray-500" />
        <input
          type="date"
          value={date}
          onChange={handleDateInputChange}
          className="pl-8 pr-3 py-1 text-center border border-gray-200 dark:border-gray-700 rounded-md bg-transparent text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="ml-2 font-medium text-gray-800 dark:text-white">
          {formatDate(date)}
        </span>
      </div>
      
      <button
        onClick={handleNextDay}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
};

export default DateSelector;