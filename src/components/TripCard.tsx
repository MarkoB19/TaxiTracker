import React, { useState } from 'react';
import { Trip } from '../types';
import { formatTime, formatCurrency, formatDistance } from '../utils/dateHelpers';
import { calculateTripTotal } from '../utils/calculations';
import { useAppContext } from '../context/AppContext';
import { BanknoteIcon, CreditCardIcon, SmartphoneIcon, CarIcon, MapPinIcon, TimerIcon, EditIcon, Trash2Icon, XIcon, CheckIcon } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  const { settings, updateTrip } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(trip);
  
  const tripTotal = calculateTripTotal(trip);
  
  const PaymentMethodIcon = () => {
    switch (trip.paymentMethod) {
      case 'cash':
        return <BanknoteIcon size={18} className="text-green-600" />;
      case 'card':
        return <CreditCardIcon size={18} className="text-blue-600" />;
      case 'app':
        return <SmartphoneIcon size={18} className="text-purple-600" />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    updateTrip(editedTrip);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTrip(trip);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Trip</h3>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={editedTrip.startTime}
                onChange={(e) => setEditedTrip({ ...editedTrip, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={editedTrip.endTime}
                onChange={(e) => setEditedTrip({ ...editedTrip, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fare Amount
              </label>
              <input
                type="number"
                value={editedTrip.fareAmount}
                onChange={(e) => setEditedTrip({ ...editedTrip, fareAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tip Amount
              </label>
              <input
                type="number"
                value={editedTrip.tipAmount}
                onChange={(e) => setEditedTrip({ ...editedTrip, tipAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Distance ({settings.distanceUnit})
            </label>
            <input
              type="number"
              value={editedTrip.distance}
              onChange={(e) => setEditedTrip({ ...editedTrip, distance: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['cash', 'card', 'app'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setEditedTrip({ ...editedTrip, paymentMethod: method as Trip['paymentMethod'] })}
                  className={`py-2 px-3 rounded-lg border text-center ${
                    editedTrip.paymentMethod === method
                      ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xs font-medium capitalize">{method}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={editedTrip.notes}
              onChange={(e) => setEditedTrip({ ...editedTrip, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <TimerIcon size={16} className="text-gray-500 mr-1" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {formatTime(trip.startTime)} - {formatTime(trip.endTime)}
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
            onClick={() => onDelete(trip.id)}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {formatCurrency(tripTotal, settings.currency)}
        </h3>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          <PaymentMethodIcon />
          <span className="text-xs font-medium capitalize">
            {trip.paymentMethod}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <CarIcon size={14} className="mr-1 text-gray-500" />
          <span>{formatDistance(trip.distance, settings.distanceUnit)}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <MapPinIcon size={14} className="mr-1 text-gray-500" />
          <span className="truncate">{trip.notes}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>Fare: {formatCurrency(trip.fareAmount, settings.currency)}</div>
        <div>Tip: {formatCurrency(trip.tipAmount, settings.currency)}</div>
      </div>
    </div>
  );
};

export default TripCard;