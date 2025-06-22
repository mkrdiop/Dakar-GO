"use client";

import { Order, DriverLocation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  User, 
  Phone, 
  Package, 
  Clock, 
  Truck as TruckIcon,
  Bike, 
  CarFront,
  CheckCircle2,
  AlertCircle,
  Package as PackageIcon
} from 'lucide-react';

interface TrackingInfoProps {
  order: Order;
  driverLocation: DriverLocation | null;
}

// Helper function to format the status
function getStatusInfo(status: string) {
  switch (status) {
    case 'pending':
      return { label: 'En attente', color: 'bg-yellow-500' };
    case 'accepted':
      return { label: 'Acceptée', color: 'bg-blue-500' };
    case 'picked_up':
      return { label: 'Ramassée', color: 'bg-blue-700' };
    case 'in_transit':
      return { label: 'En cours de livraison', color: 'bg-primary' };
    case 'delivered':
      return { label: 'Livrée', color: 'bg-green-600' };
    case 'cancelled':
      return { label: 'Annulée', color: 'bg-red-500' };
    case 'failed':
      return { label: 'Échouée', color: 'bg-red-700' };
    default:
      return { label: status, color: 'bg-gray-500' };
  }
}

// Helper function to get the vehicle icon
function getVehicleIcon(vehicleType: string) {
  switch (vehicleType) {
    case 'scooter':
      return <Bike className="h-5 w-5" />;
    case 'van':
    case 'truck':
      return <TruckIcon className="h-5 w-5" />;
    case 'car':
      return <CarFront className="h-5 w-5" />;
    default:
      return <TruckIcon className="h-5 w-5" />;
  }
}

// Helper function to get the vehicle name in French
function getVehicleName(vehicleType: string) {
  switch (vehicleType) {
    case 'scooter':
      return 'Scooter';
    case 'van':
      return 'Camionnette';
    case 'truck':
      return 'Camion';
    case 'car':
      return 'Voiture/Tricycle';
    default:
      return vehicleType;
  }
}

// Helper function to calculate delivery progress
function calculateDeliveryProgress(order: Order, driverLocation: DriverLocation | null): number {
  if (order.orderStatus === 'delivered') return 100;
  if (order.orderStatus === 'cancelled' || order.orderStatus === 'failed') return 0;
  
  // If no driver location, base on status
  if (!driverLocation) {
    switch (order.orderStatus) {
      case 'pending': return 0;
      case 'accepted': return 20;
      case 'picked_up': return 40;
      case 'in_transit': return 60;
      default: return 0;
    }
  }
  
  // If we have driver location and order is in transit, calculate based on position
  if (order.orderStatus === 'in_transit' && order.pickupLocation && order.deliveryLocation) {
    // Simple linear interpolation between pickup and delivery
    const totalDistance = calculateDistance(
      order.pickupLocation.lat, 
      order.pickupLocation.lng,
      order.deliveryLocation.lat,
      order.deliveryLocation.lng
    );
    
    const currentDistance = calculateDistance(
      driverLocation.position.lat,
      driverLocation.position.lng,
      order.deliveryLocation.lat,
      order.deliveryLocation.lng
    );
    
    // Calculate progress as percentage of distance covered
    const distanceProgress = ((totalDistance - currentDistance) / totalDistance) * 100;
    
    // Ensure progress is between 40 (picked up) and 90 (almost delivered)
    return Math.min(90, Math.max(40, distanceProgress));
  }
  
  return 50; // Default fallback
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Format time remaining
function formatTimeRemaining(estimatedArrival: Date): string {
  const now = new Date();
  const diffMs = estimatedArrival.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins <= 0) return "Arrivée imminente";
  if (diffMins === 1) return "1 minute";
  return `${diffMins} minutes`;
}

export default function TrackingInfo({ order, driverLocation }: TrackingInfoProps) {
  const statusInfo = getStatusInfo(order.orderStatus);
  const progress = calculateDeliveryProgress(order, driverLocation);
  
  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Statut</span>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-4 text-xs text-center">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${progress >= 0 ? 'bg-primary' : 'bg-muted'} mb-1`}></div>
                <span>Commande</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${progress >= 30 ? 'bg-primary' : 'bg-muted'} mb-1`}></div>
                <span>Ramassage</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${progress >= 60 ? 'bg-primary' : 'bg-muted'} mb-1`}></div>
                <span>En route</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${progress >= 100 ? 'bg-primary' : 'bg-muted'} mb-1`}></div>
                <span>Livré</span>
              </div>
            </div>
            
            {driverLocation && order.orderStatus === 'in_transit' && (
              <div className="mt-4 text-center">
                <p className="text-sm font-medium">
                  Arrivée estimée dans{' '}
                  <span className="text-primary font-bold">
                    {formatTimeRemaining(driverLocation.estimatedArrival)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Driver Info Card (only show if driver is assigned) */}
      {driverLocation && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informations du Livreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{driverLocation.driverName}</span>
              </div>
              
              <div className="flex items-center">
                {getVehicleIcon(driverLocation.vehicleType)}
                <span className="ml-2">{getVehicleName(driverLocation.vehicleType)}</span>
              </div>
              
              {driverLocation.speed > 0 && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{driverLocation.speed} km/h</span>
                </div>
              )}
              
              {order.orderStatus === 'in_transit' && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                    <span>Le livreur est en route vers votre destination</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Order Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Détails de la Commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Adresse de ramassage</p>
                <p className="text-sm text-muted-foreground">{order.pickupAddress}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Adresse de livraison</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start">
              <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Client</p>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start">
              <Package className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Articles</p>
                <p className="text-sm text-muted-foreground">{order.orderItems}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="font-medium">Total</span>
              <span className="font-bold">{order.totalAmount.toLocaleString()} FCFA</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}