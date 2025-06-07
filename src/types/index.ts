export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'CHF' | 'JPY' | 'CNY';
export type DistanceUnit = 'km' | 'mi';
export type VolumeUnit = 'L' | 'gal';

export interface UserSettings {
  darkMode: boolean;
  currency: Currency;
  distanceUnit: DistanceUnit;
  volumeUnit: VolumeUnit;
  testMode: boolean;
}

export interface TestUser {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'unpaid';
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  cardLast4: string;
  nextBillingDate: string;
}

export interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  fareAmount: number;
  tipAmount: number;
  distance: number;
  paymentMethod: 'cash' | 'card' | 'app';
  notes: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  receiptImage?: string;
  volume?: number; // For fuel expenses, stored in liters
}

export type ExpenseCategory = 
  | 'fuel'
  | 'maintenance'
  | 'insurance'
  | 'license'
  | 'cleaning'
  | 'parking'
  | 'tolls'
  | 'food'
  | 'other';

export interface DailySummary {
  date: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalTrips: number;
  totalDistance: number;
}

export interface WeeklySummary extends Omit<DailySummary, 'date'> {
  weekStart: string;
  weekEnd: string;
  dailySummaries: DailySummary[];
}

export interface MonthlySummary extends Omit<DailySummary, 'date'> {
  month: string;
  year: string;
  weeklySummaries: WeeklySummary[];
}