import { Trip, Expense, DailySummary, WeeklySummary, MonthlySummary, ExpenseCategory } from '../types';
import { getWeekRange, getMonthYear, convertDistance, convertVolume } from './dateHelpers';

export const calculateTripTotal = (trip: Trip): number => {
  return trip.fareAmount + trip.tipAmount;
};

export const calculateDailyIncome = (trips: Trip[], date: string): number => {
  return trips
    .filter(trip => trip.date === date)
    .reduce((total, trip) => total + calculateTripTotal(trip), 0);
};

export const calculateDailyExpenses = (expenses: Expense[], date: string): number => {
  return expenses
    .filter(expense => expense.date === date)
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateDailyDistance = (trips: Trip[], date: string): number => {
  return trips
    .filter(trip => trip.date === date)
    .reduce((total, trip) => total + trip.distance, 0);
};

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface PaymentMethodBreakdown {
  method: 'cash' | 'card' | 'app';
  amount: number;
  percentage: number;
  tripCount: number;
}

export interface TimeOfDayAnalysis {
  hour: number;
  tripCount: number;
  totalIncome: number;
  percentage: number;
}

export interface DayOfWeekAnalysis {
  dayName: string;
  dayIndex: number;
  tripCount: number;
  totalIncome: number;
  percentage: number;
}

export const calculateTimeOfDayAnalysis = (trips: Trip[]): TimeOfDayAnalysis[] => {
  const hourlyData: { [hour: number]: { count: number; income: number } } = {};
  
  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { count: 0, income: 0 };
  }
  
  // Process trips
  trips.forEach(trip => {
    const startHour = parseInt(trip.startTime.split(':')[0]);
    hourlyData[startHour].count++;
    hourlyData[startHour].income += calculateTripTotal(trip);
  });
  
  const totalTrips = trips.length;
  
  return Object.entries(hourlyData)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      tripCount: data.count,
      totalIncome: data.income,
      percentage: totalTrips > 0 ? (data.count / totalTrips) * 100 : 0
    }))
    .sort((a, b) => b.tripCount - a.tripCount);
};

export const calculateDayOfWeekAnalysis = (trips: Trip[]): DayOfWeekAnalysis[] => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayData: { [day: number]: { count: number; income: number } } = {};
  
  // Initialize all days
  for (let i = 0; i < 7; i++) {
    dayData[i] = { count: 0, income: 0 };
  }
  
  // Process trips
  trips.forEach(trip => {
    const dayOfWeek = new Date(trip.date).getDay();
    dayData[dayOfWeek].count++;
    dayData[dayOfWeek].income += calculateTripTotal(trip);
  });
  
  const totalTrips = trips.length;
  
  return Object.entries(dayData)
    .map(([dayIndex, data]) => ({
      dayName: dayNames[parseInt(dayIndex)],
      dayIndex: parseInt(dayIndex),
      tripCount: data.count,
      totalIncome: data.income,
      percentage: totalTrips > 0 ? (data.count / totalTrips) * 100 : 0
    }))
    .sort((a, b) => b.tripCount - a.tripCount);
};

export const calculateExpenseCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categories = ['fuel', 'maintenance', 'insurance', 'license', 'cleaning', 'parking', 'tolls', 'food', 'other'] as ExpenseCategory[];
  
  return categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const amount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
    
    return {
      category,
      amount,
      percentage
    };
  }).sort((a, b) => b.amount - a.amount); // Sort by amount descending
};

export const calculatePaymentMethodBreakdown = (trips: Trip[]): PaymentMethodBreakdown[] => {
  const totalIncome = trips.reduce((sum, trip) => sum + calculateTripTotal(trip), 0);
  
  const methods = ['cash', 'card', 'app'] as const;
  
  return methods.map(method => {
    const methodTrips = trips.filter(trip => trip.paymentMethod === method);
    const amount = methodTrips.reduce((sum, trip) => sum + calculateTripTotal(trip), 0);
    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
    
    return {
      method,
      amount,
      percentage,
      tripCount: methodTrips.length
    };
  }).sort((a, b) => b.amount - a.amount); // Sort by amount descending
};

export const createDailySummary = (trips: Trip[], expenses: Expense[], date: string): DailySummary => {
  const dailyTrips = trips.filter(trip => trip.date === date);
  const totalIncome = dailyTrips.reduce((total, trip) => total + calculateTripTotal(trip), 0);
  const totalExpenses = calculateDailyExpenses(expenses, date);
  const totalDistance = dailyTrips.reduce((total, trip) => total + trip.distance, 0);

  return {
    date,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    totalTrips: dailyTrips.length,
    totalDistance
  };
};

export const createWeeklySummary = (trips: Trip[], expenses: Expense[], startDate: string): WeeklySummary => {
  const { start, end } = getWeekRange(startDate);
  
  // Get all dates in the week
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  // Create daily summaries for each date in the week
  const dailySummaries = dates.map(date => createDailySummary(trips, expenses, date));
  
  // Calculate weekly totals
  const totalIncome = dailySummaries.reduce((total, day) => total + day.totalIncome, 0);
  const totalExpenses = dailySummaries.reduce((total, day) => total + day.totalExpenses, 0);
  const totalTrips = dailySummaries.reduce((total, day) => total + day.totalTrips, 0);
  const totalDistance = dailySummaries.reduce((total, day) => total + day.totalDistance, 0);
  
  return {
    weekStart: start,
    weekEnd: end,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    totalTrips,
    totalDistance,
    dailySummaries
  };
};

export const createMonthlySummary = (trips: Trip[], expenses: Expense[], monthDate: string): MonthlySummary => {
  const { month, year } = getMonthYear(monthDate);
  
  // Find all trips and expenses for this month
  const monthTrips = trips.filter(trip => {
    const tripDate = new Date(trip.date);
    return tripDate.getMonth() === new Date(monthDate).getMonth() && 
           tripDate.getFullYear() === new Date(monthDate).getFullYear();
  });
  
  const monthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === new Date(monthDate).getMonth() && 
           expenseDate.getFullYear() === new Date(monthDate).getFullYear();
  });
  
  // Get the first day of the month
  const firstDay = new Date(year, new Date(monthDate).getMonth(), 1);
  
  // Create weekly summaries starting from each Sunday of the month
  const weeklySummaries: WeeklySummary[] = [];
  let currentWeekStart = new Date(firstDay);
  
  // Adjust to the first Sunday before or on the first day of the month
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  
  // Loop through all weeks that overlap with the month
  const lastDay = new Date(year, new Date(monthDate).getMonth() + 1, 0); // Last day of month
  
  while (currentWeekStart <= lastDay) {
    const weeklySum = createWeeklySummary(
      monthTrips, 
      monthExpenses, 
      currentWeekStart.toISOString().split('T')[0]
    );
    weeklySummaries.push(weeklySum);
    
    // Move to the next Sunday
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  
  // Calculate monthly totals
  const totalIncome = monthTrips.reduce((total, trip) => total + calculateTripTotal(trip), 0);
  const totalExpenses = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
  const totalTrips = monthTrips.length;
  const totalDistance = monthTrips.reduce((total, trip) => total + trip.distance, 0);
  
  return {
    month,
    year,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    totalTrips,
    totalDistance,
    weeklySummaries
  };
};

export const calculateFuelEfficiency = (
  trips: Trip[], 
  fuelExpenses: Expense[],
  distanceUnit: 'km' | 'mi',
  volumeUnit: 'L' | 'gal'
): { efficiency: number; costPerDistance: number } => {
  // Get total distance from all trips
  let totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  
  // Get total fuel volume and cost from fuel expenses
  const totalFuelCost = fuelExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  let totalVolume = fuelExpenses.reduce((sum, expense) => sum + (expense.volume || 0), 0);

  // Return default values if there's no data
  if (totalDistance === 0 || totalVolume === 0) {
    return { efficiency: 0, costPerDistance: 0 };
  }

  // Convert units if necessary
  if (distanceUnit === 'mi') {
    // Convert kilometers to miles
    totalDistance = convertDistance(totalDistance, 'km', 'mi');
  }
  
  if (volumeUnit === 'gal') {
    // Convert liters to gallons
    totalVolume = convertVolume(totalVolume, 'L', 'gal');
  }

  let efficiency: number;
  
  if (distanceUnit === 'km') {
    // Calculate L/100km
    efficiency = (totalVolume * 100) / totalDistance;
  } else {
    // Calculate MPG (miles per gallon)
    efficiency = totalDistance / totalVolume;
  }

  // Calculate cost per unit distance
  const costPerDistance = totalFuelCost / totalDistance;

  return {
    efficiency: Number(efficiency.toFixed(2)),
    costPerDistance: Number(costPerDistance.toFixed(2))
  };
};