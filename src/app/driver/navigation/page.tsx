"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, DriverLocation, LatLng } from '@/lib/types';
import { getOrderById, subscribeToDriverLocation } from '@/actions/tracking';
import { ArrowLeft, Navigation as NavigationIcon, MapPin, Target, Compass } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import DriverLayout from '@/components/layout/DriverLayout';
import dynamic from 'next/dynamic';

// Import the map component dynamically to avoid SSR issues with Leaflet
const NavigationMap = dynamic(() => import('@/components/core/NavigationMap'), { 
  ssr: false,
  loading: () => <div className="h-[calc(100vh-120px)] bg-gray-100 flex items-center justify-center">Chargement de la carte...</div>
});

export default function DriverNavigation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [navigationMode, setNavigationMode] = useState<'pickup' | 'delivery'>('pickup');
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'driver'))) {
      router.push('/driver/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Fetch order details if orderId is provided
  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const orderData = await getOrderById(orderId);
          setOrder(orderData);
          
          // Set navigation mode based on order status
          if (orderData.orderStatus === 'accepted') {
            setNavigationMode('pickup');
          } else {
            setNavigationMode('delivery');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails de la commande",
            variant: "destructive",
          });
        }
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  // Subscribe to driver location updates
  useEffect(() => {
    if (order) {
      const unsubscribe = subscribeToDriverLocation(order.id, (location) => {
        setDriverLocation(location);
      });
      
      return () => unsubscribe();
    }
  }, [order]);

  // Simulate getting the driver's current location
  useEffect(() => {
    if (isLocationTracking) {
      // In a real app, this would use the device's geolocation API
      // For demo purposes, we'll use a simulated location
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (user && order) {
            const currentPosition: LatLng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            // Update driver location
            const updatedLocation: DriverLocation = {
              position: currentPosition,
              heading: 0, // Would be calculated based on movement
              speed: position.coords.speed || 0,
              lastUpdated: new Date(),
              driverId: user.id,
              driverName: `${user.firstName} ${user.lastName}`,
              vehicleType: (order.vehicleType),
              estimatedArrival: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
            };
            
            setDriverLocation(updatedLocation);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'accéder à votre position actuelle",
            variant: "destructive",
          });
          setIsLocationTracking(false);
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 0, 
          timeout: 5000 
        }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isLocationTracking, order, toast, user]);

  // Toggle location tracking
  const handleToggleLocationTracking = () => {
    if (!isLocationTracking) {
      // Request permission to access location
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocationTracking(true);
          toast({
            title: "Suivi de position activé",
            description: "Votre position est maintenant suivie en temps réel",
          });
        },
        (error) => {
          console.error('Error getting location permission:', error);
          toast({
            title: "Erreur de permission",
            description: "Veuillez autoriser l'accès à votre position pour utiliser la navigation",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocationTracking(false);
      toast({
        title: "Suivi de position désactivé",
        description: "Votre position n'est plus suivie",
      });
    }
  };

  // Switch navigation mode
  const handleSwitchNavigationMode = () => {
    setNavigationMode(prev => prev === 'pickup' ? 'delivery' : 'pickup');
    toast({
      title: `Navigation vers ${navigationMode === 'pickup' ? 'la livraison' : 'le ramassage'}`,
      description: `Itinéraire mis à jour vers ${navigationMode === 'pickup' ? 'l\'adresse de livraison' : 'l\'adresse de ramassage'}`,
    });
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  return (
    <DriverLayout>
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-xl font-bold">Navigation</h1>
          </div>
          
          <div className="flex space-x-2">
            {order && (
              <Button 
                variant="outline" 
                onClick={handleSwitchNavigationMode}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Vers {navigationMode === 'pickup' ? 'livraison' : 'ramassage'}
              </Button>
            )}
            
            <Button 
              variant={isLocationTracking ? "default" : "outline"}
              onClick={handleToggleLocationTracking}
            >
              <Target className="h-4 w-4 mr-2" />
              {isLocationTracking ? 'Suivi actif' : 'Activer suivi'}
            </Button>
          </div>
        </div>
        
        {/* Navigation Map */}
        <div className="flex-1">
          {order ? (
            <NavigationMap 
              order={order}
              driverLocation={driverLocation}
              navigationMode={navigationMode}
              isLocationTracking={isLocationTracking}
            />
          ) : (
            <Card className="m-4">
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 mb-4">
                  Aucune commande sélectionnée pour la navigation
                </p>
                <Button 
                  className="w-full"
                  onClick={() => router.push('/driver/dashboard')}
                >
                  <NavigationIcon className="h-4 w-4 mr-2" />
                  Voir mes commandes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Navigation Instructions */}
        {order && (
          <Card className="m-4">
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center">
                <Compass className="h-5 w-5 mr-2 text-blue-600" />
                Instructions de navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Continuer tout droit sur Avenue Cheikh Anta Diop</p>
                      <p className="text-sm text-gray-500">1.2 km</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">3 min</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Tourner à droite sur Rue 10</p>
                      <p className="text-sm text-gray-500">0.5 km</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">2 min</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Continuer sur Boulevard de la République</p>
                      <p className="text-sm text-gray-500">0.8 km</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">4 min</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DriverLayout>
  );
}