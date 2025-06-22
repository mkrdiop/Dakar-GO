
// As per SQL schema: vehicle_type_enum AS ENUM ('scooter', 'van', 'truck', 'car')
// AI flow uses: VehicleTypeEnum = z.enum(['scooter', 'van', 'truck', 'car'])
// User request mentions 'tricycle'. We map 'tricycle' to 'car'.
export type VehicleType = 'scooter' | 'van' | 'truck' | 'car';

export const vehicleOptions: { value: VehicleType; label: string; labelFr: string; icon: any }[] = [
  { value: 'scooter', label: 'Scooter', labelFr: 'Scooter', icon: 'Bike' },
  { value: 'van', label: 'Van', labelFr: 'Camionnette', icon: 'Truck' },
  { value: 'truck', label: 'Truck', labelFr: 'Camion', icon: 'Truck' }, // Could use different icon or style if differentiation from van is critical
  { value: 'car', label: 'Car/Tricycle', labelFr: 'Voiture/Tricycle', icon: 'CarFront' }, // 'car' maps to user's 'tricycle'
];

export type OrderStatus = 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'failed';

// Coordinates type for locations
export interface LatLng {
  lat: number;
  lng: number;
}

// Driver location with additional metadata
export interface DriverLocation {
  position: LatLng;
  heading: number; // Direction in degrees (0-360)
  speed: number; // Speed in km/h
  lastUpdated: Date;
  driverId: string;
  driverName: string;
  vehicleType: VehicleType;
  estimatedArrival: Date;
}

export interface Order {
  id: string;
  merchantId?: string; // From Orders table
  customerName: string; // From Orders table
  customerPhone: string; // From Orders table
  pickupAddress: string;
  deliveryAddress: string;
  pickupLocation?: LatLng; // POINT in DB
  deliveryLocation?: LatLng; // POINT in DB
  orderStatus: OrderStatus;
  orderDate?: Date; // From Orders table
  deliveryDate?: Date; // From Orders table
  orderItems: string; // JSON in DB, string for simple form
  totalAmount: number; // From Orders table
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'; // From Orders table
  instructions?: string; // From Orders table
  estimatedDeliveryTime?: string;
  vehicleType: VehicleType;
  driverId?: string; // Reference to the assigned driver
  driverName?: string; // Name of the assigned driver
}

export interface CreateOrderFormData {
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  orderItems: string;
  vehicleType: VehicleType;
  totalAmount: number;
  instructions?: string;
}

export type UserRole = 'merchant' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  // Add other user properties as needed
}

export interface Driver extends User {
  role: 'driver';
  vehicleType: VehicleType;
  vehiclePlate?: string;
  isAvailable: boolean;
  currentLocation?: LatLng;
  rating?: number;
  completedOrders?: number;
}

// Analytics Types
export interface AnalyticsPeriod {
  label: string;
  value: 'today' | 'week' | 'month' | 'year' | 'custom';
}

export interface DeliveryMetrics {
  total: number;
  completed: number;
  inTransit: number;
  cancelled: number;
  pending: number;
}

export interface RevenueMetrics {
  total: number;
  average: number;
  growth: number;
}

export interface PerformanceMetrics {
  deliveryTime: {
    average: number; // in minutes
    improvement: number; // percentage
  };
  customerSatisfaction: {
    rating: number; // out of 5
    improvement: number; // percentage
  };
}

export interface VehicleMetrics {
  type: VehicleType;
  count: number;
  percentage: number;
}

export interface LocationMetrics {
  name: string;
  count: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AnalyticsDashboardData {
  deliveryMetrics: DeliveryMetrics;
  revenueMetrics: RevenueMetrics;
  performanceMetrics: PerformanceMetrics;
  vehicleDistribution: VehicleMetrics[];
  topPickupLocations: LocationMetrics[];
  topDeliveryLocations: LocationMetrics[];
  deliveriesByDay: TimeSeriesData[];
  revenueByDay: TimeSeriesData[];
}
