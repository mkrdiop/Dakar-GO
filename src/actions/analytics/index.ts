import {
  AnalyticsDashboardData,
  AnalyticsPeriod,
  DeliveryMetrics,
  LocationMetrics,
  PerformanceMetrics,
  RevenueMetrics,
  TimeSeriesData,
  VehicleMetrics,
  VehicleType
} from '@/lib/types';

// Mock data for analytics dashboard
const generateMockAnalyticsData = (period: string): AnalyticsDashboardData => {
  // Generate different data based on the selected period
  const multiplier = period === 'today' ? 1 : 
                    period === 'week' ? 7 : 
                    period === 'month' ? 30 : 
                    period === 'year' ? 365 : 1;
  
  // Delivery metrics
  const deliveryMetrics: DeliveryMetrics = {
    total: Math.floor(120 * multiplier),
    completed: Math.floor(85 * multiplier),
    inTransit: Math.floor(15 * multiplier),
    cancelled: Math.floor(10 * multiplier),
    pending: Math.floor(10 * multiplier)
  };
  
  // Revenue metrics
  const revenueMetrics: RevenueMetrics = {
    total: Math.floor(350000 * multiplier), // in FCFA
    average: 2916, // average per order in FCFA
    growth: period === 'today' ? 5.2 : 
            period === 'week' ? 12.5 : 
            period === 'month' ? 18.7 : 
            period === 'year' ? 45.3 : 0
  };
  
  // Performance metrics
  const performanceMetrics: PerformanceMetrics = {
    deliveryTime: {
      average: 35, // in minutes
      improvement: period === 'today' ? 2.1 : 
                  period === 'week' ? 5.3 : 
                  period === 'month' ? 8.7 : 
                  period === 'year' ? 15.2 : 0
    },
    customerSatisfaction: {
      rating: 4.7, // out of 5
      improvement: period === 'today' ? 0.5 : 
                  period === 'week' ? 1.2 : 
                  period === 'month' ? 3.5 : 
                  period === 'year' ? 7.8 : 0
    }
  };
  
  // Vehicle distribution
  const vehicleDistribution: VehicleMetrics[] = [
    { type: 'scooter', count: Math.floor(65 * multiplier), percentage: 54 },
    { type: 'car', count: Math.floor(30 * multiplier), percentage: 25 },
    { type: 'van', count: Math.floor(15 * multiplier), percentage: 13 },
    { type: 'truck', count: Math.floor(10 * multiplier), percentage: 8 }
  ];
  
  // Top pickup locations
  const topPickupLocations: LocationMetrics[] = [
    { name: 'Plateau', count: Math.floor(25 * multiplier), percentage: 21 },
    { name: 'Almadies', count: Math.floor(20 * multiplier), percentage: 17 },
    { name: 'Sacré-Cœur', count: Math.floor(18 * multiplier), percentage: 15 },
    { name: 'Médina', count: Math.floor(15 * multiplier), percentage: 13 },
    { name: 'Yoff', count: Math.floor(12 * multiplier), percentage: 10 }
  ];
  
  // Top delivery locations
  const topDeliveryLocations: LocationMetrics[] = [
    { name: 'Almadies', count: Math.floor(28 * multiplier), percentage: 23 },
    { name: 'Plateau', count: Math.floor(22 * multiplier), percentage: 18 },
    { name: 'Mermoz', count: Math.floor(18 * multiplier), percentage: 15 },
    { name: 'Ouakam', count: Math.floor(15 * multiplier), percentage: 13 },
    { name: 'Ngor', count: Math.floor(12 * multiplier), percentage: 10 }
  ];
  
  // Generate time series data based on period
  const deliveriesByDay: TimeSeriesData[] = generateTimeSeriesData(period, 'deliveries');
  const revenueByDay: TimeSeriesData[] = generateTimeSeriesData(period, 'revenue');
  
  return {
    deliveryMetrics,
    revenueMetrics,
    performanceMetrics,
    vehicleDistribution,
    topPickupLocations,
    topDeliveryLocations,
    deliveriesByDay,
    revenueByDay
  };
};

// Helper function to generate time series data
const generateTimeSeriesData = (period: string, type: 'deliveries' | 'revenue'): TimeSeriesData[] => {
  const result: TimeSeriesData[] = [];
  const now = new Date();
  let days = 0;
  
  switch (period) {
    case 'today':
      // Hourly data for today
      for (let i = 0; i < 24; i++) {
        const date = new Date(now);
        date.setHours(i, 0, 0, 0);
        
        // Generate random value with a pattern (more deliveries during day, less at night)
        let value = 0;
        if (i >= 8 && i <= 20) {
          // Business hours: higher values
          value = type === 'deliveries' 
            ? Math.floor(Math.random() * 10) + 5 
            : Math.floor(Math.random() * 20000) + 10000;
        } else {
          // Non-business hours: lower values
          value = type === 'deliveries' 
            ? Math.floor(Math.random() * 3) 
            : Math.floor(Math.random() * 5000);
        }
        
        result.push({
          date: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value
        });
      }
      break;
      
    case 'week':
      // Daily data for the past week
      days = 7;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const value = type === 'deliveries' 
          ? Math.floor(Math.random() * 30) + 10 
          : Math.floor(Math.random() * 100000) + 30000;
        
        result.push({
          date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
          value
        });
      }
      break;
      
    case 'month':
      // Weekly data for the past month
      days = 30;
      for (let i = 0; i < 4; i++) {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - (days - i * 7));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        const value = type === 'deliveries' 
          ? Math.floor(Math.random() * 150) + 50 
          : Math.floor(Math.random() * 500000) + 100000;
        
        result.push({
          date: `${startDate.toLocaleDateString('fr-FR', { day: 'numeric' })} - ${endDate.toLocaleDateString('fr-FR', { day: 'numeric' })}`,
          value
        });
      }
      break;
      
    case 'year':
      // Monthly data for the past year
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        const value = type === 'deliveries' 
          ? Math.floor(Math.random() * 500) + 200 
          : Math.floor(Math.random() * 2000000) + 500000;
        
        result.push({
          date: date.toLocaleDateString('fr-FR', { month: 'short' }),
          value
        });
      }
      break;
      
    default:
      // Default to weekly data
      days = 7;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const value = type === 'deliveries' 
          ? Math.floor(Math.random() * 30) + 10 
          : Math.floor(Math.random() * 100000) + 30000;
        
        result.push({
          date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
          value
        });
      }
  }
  
  return result;
};

// Available time periods for analytics
export const analyticsPeriods: AnalyticsPeriod[] = [
  { label: "Aujourd'hui", value: 'today' },
  { label: '7 derniers jours', value: 'week' },
  { label: '30 derniers jours', value: 'month' },
  { label: '12 derniers mois', value: 'year' }
];

// Function to get analytics data
export async function getAnalyticsData(period: string = 'week'): Promise<AnalyticsDashboardData> {
  // In a real app, this would fetch data from an API
  // For now, we'll generate mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return generateMockAnalyticsData(period);
}