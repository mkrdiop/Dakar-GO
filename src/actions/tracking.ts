'use server';

import { Order, DriverLocation, LatLng } from '@/lib/types';

// Mock data for orders with location information
const mockOrdersWithLocation: Order[] = [
  { 
    id: 'dkr123', 
    customerName: 'Aminata Fall', 
    customerPhone: '771234567', 
    pickupAddress: 'Yoff Virage', 
    deliveryAddress: 'Plateau, Rue 23', 
    orderStatus: 'in_transit', 
    orderItems: 'Documents importants', 
    totalAmount: 2500, 
    vehicleType: 'scooter', 
    orderDate: new Date(),
    pickupLocation: { lat: 14.7645, lng: -17.3660 }, // Yoff Virage
    deliveryLocation: { lat: 14.6937, lng: -17.4441 }, // Plateau
    driverId: 'driver001',
    driverName: 'Moussa Sow'
  },
  { 
    id: 'dkr456', 
    customerName: 'Moussa Diop', 
    customerPhone: '781234567', 
    pickupAddress: 'Sacré Coeur 3', 
    deliveryAddress: 'Almadies, Ngor', 
    orderStatus: 'in_transit', 
    orderItems: 'Colis fragile (vase)', 
    totalAmount: 5000, 
    vehicleType: 'van', 
    orderDate: new Date(Date.now() - 86400000 * 1),
    estimatedDeliveryTime: '35 minutes',
    pickupLocation: { lat: 14.7247, lng: -17.4752 }, // Sacré Coeur
    deliveryLocation: { lat: 14.7471, lng: -17.5233 }, // Almadies
    driverId: 'driver002',
    driverName: 'Fatou Diallo'
  },
  { 
    id: 'dkr789', 
    customerName: 'Aicha Ba', 
    customerPhone: '761234567', 
    pickupAddress: 'Liberté 6', 
    deliveryAddress: 'Fann Hock', 
    orderStatus: 'delivered', 
    orderItems: 'Repas chaud (Thieboudienne)', 
    totalAmount: 3000, 
    vehicleType: 'scooter', 
    orderDate: new Date(Date.now() - 86400000 * 2),
    deliveryDate: new Date(Date.now() - 86400000 * 1.9),
    pickupLocation: { lat: 14.7247, lng: -17.4552 }, // Liberté 6
    deliveryLocation: { lat: 14.6837, lng: -17.4541 }, // Fann Hock
    driverId: 'driver003',
    driverName: 'Ibrahima Ndiaye'
  },
];

// Function to get order by ID
export async function getOrderById(orderId: string): Promise<Order> {
  // In a real app, this would fetch from a database or API
  const order = mockOrdersWithLocation.find(o => o.id === orderId);
  
  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
  
  return order;
}

// Simulated driver locations for demo purposes
const simulatedDriverPaths: Record<string, LatLng[]> = {
  'driver001': [
    { lat: 14.7645, lng: -17.3660 }, // Start at pickup
    { lat: 14.7500, lng: -17.3800 },
    { lat: 14.7350, lng: -17.4000 },
    { lat: 14.7200, lng: -17.4200 },
    { lat: 14.7050, lng: -17.4300 },
    { lat: 14.6937, lng: -17.4441 }, // End at delivery
  ],
  'driver002': [
    { lat: 14.7247, lng: -17.4752 }, // Start at pickup
    { lat: 14.7300, lng: -17.4850 },
    { lat: 14.7350, lng: -17.4950 },
    { lat: 14.7400, lng: -17.5050 },
    { lat: 14.7450, lng: -17.5150 },
    { lat: 14.7471, lng: -17.5233 }, // End at delivery
  ],
  'driver003': [
    { lat: 14.7247, lng: -17.4552 }, // Start at pickup
    { lat: 14.7150, lng: -17.4550 },
    { lat: 14.7050, lng: -17.4545 },
    { lat: 14.6950, lng: -17.4543 },
    { lat: 14.6837, lng: -17.4541 }, // End at delivery
  ],
};

// Function to calculate heading between two points
function calculateHeading(start: LatLng, end: LatLng): number {
  const startLat = start.lat * Math.PI / 180;
  const startLng = start.lng * Math.PI / 180;
  const endLat = end.lat * Math.PI / 180;
  const endLng = end.lng * Math.PI / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  const heading = Math.atan2(y, x) * 180 / Math.PI;
  
  return (heading + 360) % 360; // Normalize to 0-360
}

// Function to subscribe to driver location updates
export function subscribeToDriverLocation(
  orderId: string, 
  callback: (location: DriverLocation) => void
): () => void {
  // In a real app, this would use WebSockets or a real-time database
  const order = mockOrdersWithLocation.find(o => o.id === orderId);
  
  if (!order || !order.driverId) {
    console.error(`Order ${orderId} not found or has no driver assigned`);
    return () => {}; // Return empty cleanup function
  }
  
  const driverId = order.driverId;
  const path = simulatedDriverPaths[driverId];
  
  if (!path || path.length < 2) {
    console.error(`No path found for driver ${driverId}`);
    return () => {};
  }
  
  let currentIndex = 0;
  
  // For demo purposes, move along the path every few seconds
  const intervalId = setInterval(() => {
    if (currentIndex >= path.length - 1) {
      // If we've reached the end of the path, stop updating
      clearInterval(intervalId);
      return;
    }
    
    const currentPosition = path[currentIndex];
    const nextPosition = path[currentIndex + 1];
    
    // Calculate heading based on current and next position
    const heading = calculateHeading(currentPosition, nextPosition);
    
    // Calculate a random speed between 20-40 km/h
    const speed = Math.floor(Math.random() * 20) + 20;
    
    // Calculate estimated arrival time (simple calculation for demo)
    const remainingPoints = path.length - currentIndex - 1;
    const minutesPerPoint = 5; // Assume each point takes 5 minutes
    const estimatedMinutes = remainingPoints * minutesPerPoint;
    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + estimatedMinutes);
    
    // Create driver location object
    const driverLocation: DriverLocation = {
      position: currentPosition,
      heading,
      speed,
      lastUpdated: new Date(),
      driverId: order.driverId!,
      driverName: order.driverName || 'Unknown Driver',
      vehicleType: order.vehicleType,
      estimatedArrival,
    };
    
    // Call the callback with the updated location
    callback(driverLocation);
    
    // Move to the next position in the path
    currentIndex++;
  }, 5000); // Update every 5 seconds
  
  // Return a cleanup function to clear the interval
  return () => clearInterval(intervalId);
}