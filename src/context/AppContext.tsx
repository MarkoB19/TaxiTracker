import React, { createContext, useState, useContext, useEffect } from 'react';
import { Trip, Expense, DailySummary, Currency, DistanceUnit, VolumeUnit, UserSettings, TestUser } from '../types';
import { createDailySummary } from '../utils/calculations';
import { getCurrentDateString } from '../utils/dateHelpers';

interface AppContextType {
  trips: Trip[];
  expenses: Expense[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  getDailySummary: (date: string) => DailySummary;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  clearData: () => void;
  testUser: TestUser | null;
  createTestUser: (email: string, name: string) => void;
  updateTestUser: (data: Partial<TestUser>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialTrips: Trip[] = [
  {
    id: '1',
    date: getCurrentDateString(),
    startTime: '08:30',
    endTime: '09:15',
    fareAmount: 25.50,
    tipAmount: 5.00,
    distance: 14,
    paymentMethod: 'card',
    notes: 'Airport pickup'
  },
  {
    id: '2',
    date: getCurrentDateString(),
    startTime: '10:00',
    endTime: '10:25',
    fareAmount: 12.75,
    tipAmount: 2.00,
    distance: 5.6,
    paymentMethod: 'cash',
    notes: 'Downtown drop-off'
  }
];

const initialExpenses: Expense[] = [
  {
    id: '1',
    date: getCurrentDateString(),
    amount: 45.80,
    category: 'fuel',
    description: 'Full tank at Shell',
    volume: 30 // 30 liters
  },
  {
    id: '2',
    date: getCurrentDateString(),
    amount: 12.99,
    category: 'food',
    description: 'Lunch'
  }
];

const initialSettings: UserSettings = {
  darkMode: false,
  currency: 'EUR',
  distanceUnit: 'km',
  volumeUnit: 'L',
  testMode: false
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const savedTrips = localStorage.getItem('taxiAppTrips');
    return savedTrips ? JSON.parse(savedTrips) : initialTrips;
  });
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('taxiAppExpenses');
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('taxiAppSettings');
    return savedSettings ? JSON.parse(savedSettings) : initialSettings;
  });

  const [testUser, setTestUser] = useState<TestUser | null>(() => {
    const savedTestUser = localStorage.getItem('taxiAppTestUser');
    return savedTestUser ? JSON.parse(savedTestUser) : null;
  });
  
  const [currentDate, setCurrentDate] = useState<string>(getCurrentDateString());

  useEffect(() => {
    localStorage.setItem('taxiAppTrips', JSON.stringify(trips));
  }, [trips]);
  
  useEffect(() => {
    localStorage.setItem('taxiAppExpenses', JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem('taxiAppSettings', JSON.stringify(settings));
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('taxiAppTestUser', JSON.stringify(testUser));
  }, [testUser]);

  const addTrip = (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString()
    };
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === updatedTrip.id ? updatedTrip : trip
      )
    );
  };

  const deleteTrip = (id: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const getDailySummary = (date: string): DailySummary => {
    return createDailySummary(trips, expenses, date);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearData = () => {
    setTrips([]);
    setExpenses([]);
    setTestUser(null);
  };

  const createTestUser = (email: string, name: string) => {
    const newTestUser: TestUser = {
      id: Date.now().toString(),
      email,
      name,
      subscriptionStatus: 'active',
      subscriptionPlan: 'basic',
      cardLast4: '4242',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setTestUser(newTestUser);
  };

  const updateTestUser = (data: Partial<TestUser>) => {
    setTestUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AppContext.Provider
      value={{
        trips,
        expenses,
        addTrip,
        updateTrip,
        deleteTrip,
        addExpense,
        updateExpense,
        deleteExpense,
        currentDate,
        setCurrentDate,
        getDailySummary,
        settings,
        updateSettings,
        clearData,
        testUser,
        createTestUser,
        updateTestUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};