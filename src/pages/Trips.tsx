import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TripCard from '../components/TripCard';
import DateSelector from '../components/DateSelector';
import { SearchIcon, FilterIcon, PlusIcon, CarFrontIcon } from 'lucide-react';

const Trips: React.FC = () => {
  const { trips, currentDate, setCurrentDate, deleteTrip } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string | null>(null);
  
  // Get trips for the selected date and apply filters
  const filteredTrips = trips
    .filter(trip => trip.date === currentDate)
    .filter(trip => {
      if (searchQuery === '') return true;
      return (
        trip.notes.toLowerCase().includes(searchQuery.toLowerCase()) || 
        trip.distance.toString().includes(searchQuery)
      );
    })
    .filter(trip => {
      if (!filterPaymentMethod) return true;
      return trip.paymentMethod === filterPaymentMethod;
    });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Trips
        </h1>
        <Link
          to="/add-trip"
          className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={16} className="mr-1" />
          Add Trip
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
            placeholder="Search trips..."
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
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'cash', 'card', 'app'].map((method) => (
                <button
                  key={method}
                  onClick={() => setFilterPaymentMethod(method === 'all' ? null : method)}
                  className={`py-1 px-3 text-xs rounded-full ${
                    (method === 'all' && !filterPaymentMethod) || method === filterPaymentMethod
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {filteredTrips.length === 0 ? (
        <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <CarFrontIcon size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            No trips found for this day
          </p>
          <Link
            to="/add-trip"
            className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add Your First Trip
          </Link>
        </div>
      ) : (
        <div>
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={(trip) => console.log('Edit trip', trip)}
              onDelete={deleteTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;