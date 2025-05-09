
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

export interface Order {
  id: string;
  merchantId?: string; // From Orders table
  customerName: string; // From Orders table
  customerPhone: string; // From Orders table
  pickupAddress: string;
  deliveryAddress: string;
  // pickupLocation?: { lat: number; lng: number }; // POINT in DB
  // deliveryLocation?: { lat: number; lng: number }; // POINT in DB
  orderStatus: OrderStatus;
  orderDate?: Date; // From Orders table
  deliveryDate?: Date; // From Orders table
  orderItems: string; // JSON in DB, string for simple form
  totalAmount: number; // From Orders table
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'; // From Orders table
  instructions?: string; // From Orders table
  estimatedDeliveryTime?: string;
  vehicleType: VehicleType;
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
