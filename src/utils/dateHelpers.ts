export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5); // Format as HH:MM
};

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  const currencyMap: { [key: string]: { locale: string; currency: string } } = {
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    AUD: { locale: 'en-AU', currency: 'AUD' },
    CAD: { locale: 'en-CA', currency: 'CAD' },
    CHF: { locale: 'de-CH', currency: 'CHF' },
    JPY: { locale: 'ja-JP', currency: 'JPY' },
    CNY: { locale: 'zh-CN', currency: 'CNY' }
  };

  const { locale, currency: curr } = currencyMap[currency] || currencyMap.EUR;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDistance = (distance: number, unit: 'km' | 'mi' = 'km'): string => {
  if (unit === 'km') {
    return `${distance.toFixed(1)} km`;
  }
  // Convert km to miles if needed
  const miles = distance * 0.621371;
  return `${miles.toFixed(1)} mi`;
};

export const convertDistance = (distance: number, fromUnit: 'km' | 'mi', toUnit: 'km' | 'mi'): number => {
  if (fromUnit === toUnit) return distance;
  return fromUnit === 'km' ? distance * 0.621371 : distance * 1.60934;
};

export const formatVolume = (volume: number, unit: 'L' | 'gal' = 'L'): string => {
  if (unit === 'L') {
    return `${volume.toFixed(1)} L`;
  }
  // Convert liters to gallons
  const gallons = volume * 0.264172;
  return `${gallons.toFixed(1)} gal`;
};

export const convertVolume = (volume: number, fromUnit: 'L' | 'gal', toUnit: 'L' | 'gal'): number => {
  if (fromUnit === toUnit) return volume;
  return fromUnit === 'L' ? volume * 0.264172 : volume * 3.78541;
};

export const getCurrentDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return now.toTimeString().substring(0, 5); // HH:MM
};

export const getDayOfWeek = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
};

export const getWeekRange = (date: string): { start: string; end: string } => {
  const current = new Date(date);
  const day = current.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Calculate the date of the Sunday that started this week
  const startDate = new Date(current);
  startDate.setDate(current.getDate() - day);
  
  // Calculate the date of the Saturday that ends this week
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0]
  };
};

export const getMonthYear = (date: string): { month: string; year: string } => {
  const dateObj = new Date(date);
  return {
    month: dateObj.toLocaleDateString('en-US', { month: 'long' }),
    year: dateObj.getFullYear().toString()
  };
};