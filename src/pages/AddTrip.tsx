import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getCurrentDateString, getCurrentTimeString } from '../utils/dateHelpers';
import { ChevronLeftIcon, CarFrontIcon, BanknoteIcon, CreditCardIcon, SmartphoneIcon, DollarSignIcon } from 'lucide-react';

const AddTrip: React.FC = () => {
  const navigate = useNavigate();
  const { addTrip, currentDate, settings } = useAppContext();
  
  const [tripData, setTripData] = useState({
    date: currentDate,
    startTime: getCurrentTimeString(),
    endTime: getCurrentTimeString(),
    fareAmount: 0,
    tipAmount: 0,
    distance: 0,
    paymentMethod: 'cash' as 'cash' | 'card' | 'app',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setTripData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrip(tripData);
    navigate('/trips');
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
          Add New Trip
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
            value={tripData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={tripData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={tripData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <DollarSignIcon size={16} className="inline mr-1" />
              Fare Amount ({getCurrencySymbol()})
            </label>
            <input
              type="number"
              name="fareAmount"
              value={tripData.fareAmount || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <DollarSignIcon size={16} className="inline mr-1" />
              Tip Amount ({getCurrencySymbol()})
            </label>
            <input
              type="number"
              name="tipAmount"
              value={tripData.tipAmount || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Distance ({settings.distanceUnit})
          </label>
          <input
            type="number"
            name="distance"
            value={tripData.distance || ''}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTripData(prev => ({ ...prev, paymentMethod: 'cash' }))}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border ${
                tripData.paymentMethod === 'cash'
                  ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <BanknoteIcon size={20} className="mb-1" />
              <span className="text-xs font-medium">Cash</span>
            </button>
            
            <button
              type="button"
              onClick={() => setTripData(prev => ({ ...prev, paymentMethod: 'card' }))}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border ${
                tripData.paymentMethod === 'card'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <CreditCardIcon size={20} className="mb-1" />
              <span className="text-xs font-medium">Card</span>
            </button>
            
            <button
              type="button"
              onClick={() => setTripData(prev => ({ ...prev, paymentMethod: 'app' }))}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border ${
                tripData.paymentMethod === 'app'
                  ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <SmartphoneIcon size={20} className="mb-1" />
              <span className="text-xs font-medium">App</span>
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={tripData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Airport pickup, downtown dropoff, etc."
          ></textarea>
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
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Trip
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrip;