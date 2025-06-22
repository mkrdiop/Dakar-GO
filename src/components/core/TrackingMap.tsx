"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngBounds, LatLngExpression } from 'leaflet';
import { Order, DriverLocation, LatLng } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Bike, Truck, CarFront, MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom component to update the map view when bounds change
function MapBoundsUpdater({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  
  return null;
}

// Custom component to recenter the map on the driver's location
function MapCenterUpdater({ position }: { position: LatLng }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([position.lat, position.lng], map.getZoom());
  }, [map, position]);
  
  return null;
}

// Create custom icons for different vehicle types
const createVehicleIcon = (vehicleType: string) => {
  // Define the icon HTML based on vehicle type
  let iconHtml = '';
  
  switch (vehicleType) {
    case 'scooter':
      iconHtml = `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>
                  </div>`;
      break;
    case 'van':
    case 'truck':
      iconHtml = `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                  </div>`;
      break;
    case 'car':
      iconHtml = `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car-front"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
                  </div>`;
      break;
    default:
      iconHtml = `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  </div>`;
  }
  
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconHtml),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Create custom icons for pickup and delivery locations
const pickupIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#32CD32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const deliveryIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFA500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface TrackingMapProps {
  order: Order;
  driverLocation: DriverLocation | null;
}

export default function TrackingMap({ order, driverLocation }: TrackingMapProps) {
  // Default center on Dakar if no locations are provided
  const defaultCenter: LatLngExpression = [14.7167, -17.4677];
  
  // Calculate bounds to fit all markers
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  
  // Track if the map should follow the driver
  const [followDriver, setFollowDriver] = useState(true);
  
  // Fix for Leaflet marker icons in Next.js
  useEffect(() => {
    // This is needed to fix the marker icon issue with Leaflet in Next.js
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);
  
  // Create a path from pickup to delivery
  const routePath: LatLngExpression[] = [];
  
  if (order.pickupLocation) {
    routePath.push([order.pickupLocation.lat, order.pickupLocation.lng]);
  }
  
  if (order.deliveryLocation) {
    routePath.push([order.deliveryLocation.lat, order.deliveryLocation.lng]);
  }
  
  // Update bounds when locations change
  useEffect(() => {
    if (!order.pickupLocation || !order.deliveryLocation) return;
    
    // Create bounds object
    const newBounds = new LatLngBounds(
      [order.pickupLocation.lat, order.pickupLocation.lng],
      [order.deliveryLocation.lat, order.deliveryLocation.lng]
    );
    
    // If driver location exists, extend bounds to include it
    if (driverLocation) {
      newBounds.extend([driverLocation.position.lat, driverLocation.position.lng]);
    }
    
    // Add some padding
    newBounds.pad(0.2);
    
    setBounds(newBounds);
  }, [order, driverLocation]);
  
  return (
    <Card className="overflow-hidden">
      <div className="h-[500px] relative">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Pickup location marker */}
          {order.pickupLocation && (
            <Marker 
              position={[order.pickupLocation.lat, order.pickupLocation.lng]}
              icon={pickupIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Point de ramassage</strong><br />
                  {order.pickupAddress}
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Delivery location marker */}
          {order.deliveryLocation && (
            <Marker 
              position={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
              icon={deliveryIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Point de livraison</strong><br />
                  {order.deliveryAddress}
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Driver location marker */}
          {driverLocation && (
            <Marker 
              position={[driverLocation.position.lat, driverLocation.position.lng]}
              icon={createVehicleIcon(order.vehicleType)}
              rotationAngle={driverLocation.heading}
              rotationOrigin="center"
            >
              <Popup>
                <div className="text-sm">
                  <strong>Livreur: {driverLocation.driverName}</strong><br />
                  Vitesse: {driverLocation.speed} km/h<br />
                  Dernière mise à jour: {driverLocation.lastUpdated.toLocaleTimeString()}
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Route line */}
          {routePath.length > 1 && (
            <Polyline 
              positions={routePath}
              color="#32CD32"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
          
          {/* Update map bounds */}
          {bounds && <MapBoundsUpdater bounds={bounds} />}
          
          {/* Center on driver if following */}
          {followDriver && driverLocation && (
            <MapCenterUpdater position={driverLocation.position} />
          )}
        </MapContainer>
        
        {/* Map controls overlay */}
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <button 
            onClick={() => setFollowDriver(!followDriver)}
            className={`p-2 rounded-full ${followDriver ? 'bg-primary' : 'bg-secondary'} text-white shadow-md`}
            title={followDriver ? "Arrêter de suivre le livreur" : "Suivre le livreur"}
          >
            <Navigation size={20} />
          </button>
          
          {bounds && (
            <button 
              onClick={() => {
                // This will trigger the MapBoundsUpdater to fit all markers
                setBounds(new LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast()));
              }}
              className="p-2 rounded-full bg-secondary text-white shadow-md"
              title="Voir tout le trajet"
            >
              <MapPin size={20} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}