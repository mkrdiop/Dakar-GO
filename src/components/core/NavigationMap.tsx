"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Order, DriverLocation } from '@/lib/types';
import { Car, MapPin, Navigation } from 'lucide-react';

// Fix for the missing icon issue in Leaflet
import 'leaflet/dist/leaflet.css';
import { useToast } from '@/hooks/useToast';

// Define custom icon for the driver marker
const createDriverIcon = (vehicleType: string) => {
  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #32CD32; color: white; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11 2 11.3V15c0 .6.4 1 1 1h2"></path>
        <circle cx="7" cy="17" r="2"></circle>
        <path d="M9 17h6"></path>
        <circle cx="17" cy="17" r="2"></circle>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Define custom icons for pickup and delivery markers
const pickupIcon = L.divIcon({
  className: 'pickup-marker',
  html: `<div style="color: #32CD32; transform: scale(1.5);">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const deliveryIcon = L.divIcon({
  className: 'delivery-marker',
  html: `<div style="color: #FFA500; transform: scale(1.5);">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Component to recenter the map when driver location changes
function MapController({ 
  driverLocation, 
  followDriver, 
  destination 
}: { 
  driverLocation: DriverLocation | null;
  followDriver: boolean;
  destination: L.LatLngExpression | null;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (followDriver && driverLocation) {
      map.setView([driverLocation.position.lat, driverLocation.position.lng], 15);
    } else if (destination) {
      map.setView(destination, 15);
    }
  }, [driverLocation, followDriver, destination, map]);
  
  return null;
}

interface NavigationMapProps {
  order: Order;
  driverLocation: DriverLocation | null;
  navigationMode: 'pickup' | 'delivery';
  isLocationTracking: boolean;
}

export default function NavigationMap({ 
  order, 
  driverLocation, 
  navigationMode,
  isLocationTracking
}: NavigationMapProps) {
  const [routePoints, setRoutePoints] = useState<L.LatLngExpression[]>([]);
  const { toast } = useToast();
  const mapRef = useRef<L.Map | null>(null);
  
  // Determine destination based on navigation mode
  const destination = navigationMode === 'pickup' 
    ? (order.pickupLocation ? [order.pickupLocation.lat, order.pickupLocation.lng] as L.LatLngExpression : null)
    : (order.deliveryLocation ? [order.deliveryLocation.lat, order.deliveryLocation.lng] as L.LatLngExpression : null);
  
  // Generate a route between driver and destination
  useEffect(() => {
    if (driverLocation && destination) {
      // In a real app, this would call a routing API like Mapbox or Google Directions
      // For demo purposes, we'll create a simple straight line
      const start: L.LatLngExpression = [driverLocation.position.lat, driverLocation.position.lng];
      
      // Create a simple route with a few intermediate points
      const points: L.LatLngExpression[] = [start];
      
      // Add some intermediate points to simulate a route
      const steps = 5;
      for (let i = 1; i < steps; i++) {
        const ratio = i / steps;
        const lat = driverLocation.position.lat + (destination[0] - driverLocation.position.lat) * ratio;
        const lng = driverLocation.position.lng + (destination[1] - driverLocation.position.lng) * ratio;
        points.push([lat, lng]);
      }
      
      points.push(destination);
      setRoutePoints(points);
    }
  }, [driverLocation, destination]);
  
  // Default center if no driver location or destination
  const defaultCenter: L.LatLngExpression = [14.7167, -17.4677]; // Dakar
  
  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Pickup Marker */}
        {order.pickupLocation && (
          <Marker 
            position={[order.pickupLocation.lat, order.pickupLocation.lng]}
            icon={pickupIcon}
          >
            <Popup>
              <div>
                <p className="font-semibold">Point de ramassage</p>
                <p>{order.pickupAddress}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Delivery Marker */}
        {order.deliveryLocation && (
          <Marker 
            position={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
            icon={deliveryIcon}
          >
            <Popup>
              <div>
                <p className="font-semibold">Point de livraison</p>
                <p>{order.deliveryAddress}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Driver Marker */}
        {driverLocation && (
          <Marker 
            position={[driverLocation.position.lat, driverLocation.position.lng]}
            icon={createDriverIcon(driverLocation.vehicleType)}
            rotationAngle={driverLocation.heading}
            rotationOrigin="center"
          >
            <Popup>
              <div>
                <p className="font-semibold">{driverLocation.driverName}</p>
                <p>Vitesse: {driverLocation.speed} km/h</p>
                <p>Mise à jour: {new Date(driverLocation.lastUpdated).toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Route Line */}
        {routePoints.length > 0 && (
          <Polyline 
            positions={routePoints}
            color="#3B82F6"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
        
        {/* Map Controller for centering */}
        <MapController 
          driverLocation={driverLocation} 
          followDriver={isLocationTracking}
          destination={destination}
        />
      </MapContainer>
    </div>
  );
}