"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Order, DriverLocation } from '@/lib/types';
import { getOrderById, subscribeToDriverLocation } from '@/actions/tracking';
import { MapPin, Navigation, Package, Clock, User, Phone, Truck, ArrowLeft, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import DriverLayout from '@/components/layout/DriverLayout';
import dynamic from 'next/dynamic';

// Import the map component dynamically to avoid SSR issues with Leaflet
const TrackingMap = dynamic(() => import('@/components/core/TrackingMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 flex items-center justify-center">Chargement de la carte...</div>
});

// Status mapping for display
const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Acceptée', color: 'bg-blue-100 text-blue-800' },
  picked_up: { label: 'Récupérée', color: 'bg-indigo-100 text-indigo-800' },
  in_transit: { label: 'En livraison', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  failed: { label: 'Échouée', color: 'bg-gray-100 text-gray-800' },
};

export default function DriverOrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'driver'))) {
      router.push('/driver/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (typeof id === 'string') {
          const orderData = await getOrderById(id);
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la commande",
          variant: "destructive",
        });
      }
    };

    fetchOrder();
  }, [id, toast]);

  // Subscribe to driver location updates
  useEffect(() => {
    if (order && (order.orderStatus === 'in_transit' || order.orderStatus === 'picked_up')) {
      const unsubscribe = subscribeToDriverLocation(order.id, (location) => {
        setDriverLocation(location);
      });
      
      return () => unsubscribe();
    }
  }, [order]);

  // Handle order status update
  const handleUpdateStatus = async (newStatus: 'picked_up' | 'in_transit' | 'delivered') => {
    setIsUpdatingStatus(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just update the local state
      setOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      
      toast({
        title: "Statut mis à jour",
        description: `La commande est maintenant ${statusMap[newStatus].label.toLowerCase()}`,
      });
      
      // If the order is delivered, redirect to dashboard after a short delay
      if (newStatus === 'delivered') {
        setTimeout(() => {
          router.push('/driver/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle call customer
  const handleCallCustomer = () => {
    if (order?.customerPhone) {
      // In a real mobile app, this would use native capabilities
      window.location.href = `tel:${order.customerPhone}`;
    }
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  if (!order) {
    return (
      <DriverLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold">Détails de la commande</h1>
          </div>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Commande non trouvée</p>
            </CardContent>
          </Card>
        </div>
      </DriverLayout>
    );
  }
  
  return (
    <DriverLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Commande #{order.id}</h1>
          <Badge className={`ml-4 ${statusMap[order.orderStatus].color}`}>
            {statusMap[order.orderStatus].label}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            {(order.orderStatus === 'in_transit' || order.orderStatus === 'picked_up') && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Suivi en temps réel</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px]">
                    <TrackingMap 
                      order={order}
                      driverLocation={driverLocation}
                      followDriver={true}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Order Details */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Détails de la commande</CardTitle>
                <CardDescription>
                  Créée le {new Date(order.orderDate!).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-start space-x-2 mb-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse de ramassage:</p>
                        <p className="text-sm text-gray-600">{order.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Navigation className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse de livraison:</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start space-x-2 mb-3">
                      <User className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Client:</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Colis:</p>
                        <p className="text-sm text-gray-600">{order.orderItems}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Véhicule</p>
                    <p className="font-medium">{order.vehicleType.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Montant</p>
                    <p className="font-medium">{order.totalAmount} FCFA</p>
                  </div>
                  {order.estimatedDeliveryTime && (
                    <div>
                      <p className="text-sm text-gray-500">Temps estimé</p>
                      <p className="font-medium">{order.estimatedDeliveryTime}</p>
                    </div>
                  )}
                </div>
                
                {order.instructions && (
                  <>
                    <Separator />
                    <div>
                      <p className="font-medium mb-1">Instructions spéciales:</p>
                      <p className="text-sm text-gray-600">{order.instructions}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Action Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.orderStatus === 'accepted' && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpdateStatus('picked_up')}
                    disabled={isUpdatingStatus}
                  >
                    Colis récupéré
                  </Button>
                )}
                {order.orderStatus === 'picked_up' && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpdateStatus('in_transit')}
                    disabled={isUpdatingStatus}
                  >
                    En route pour la livraison
                  </Button>
                )}
                {order.orderStatus === 'in_transit' && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpdateStatus('delivered')}
                    disabled={isUpdatingStatus}
                  >
                    Confirmer la livraison
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCallCustomer}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler le client
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/driver/navigation?orderId=${order.id}`)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Ouvrir la navigation
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contacter le client
                </Button>
              </CardContent>
            </Card>
            
            {/* Delivery Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Progression de la livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.orderStatus !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <CheckIcon />
                      </div>
                      <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">Commande acceptée</p>
                      <p className="text-sm text-gray-500">
                        {order.orderStatus !== 'pending' ? 'Commande prise en charge' : 'En attente'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ['picked_up', 'in_transit', 'delivered'].includes(order.orderStatus) 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <CheckIcon />
                      </div>
                      <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">Colis récupéré</p>
                      <p className="text-sm text-gray-500">
                        {['picked_up', 'in_transit', 'delivered'].includes(order.orderStatus) 
                          ? 'Colis en votre possession' 
                          : 'En attente'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ['in_transit', 'delivered'].includes(order.orderStatus) 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <CheckIcon />
                      </div>
                      <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">En route</p>
                      <p className="text-sm text-gray-500">
                        {['in_transit', 'delivered'].includes(order.orderStatus) 
                          ? 'En cours de livraison' 
                          : 'En attente'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        order.orderStatus === 'delivered' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <CheckIcon />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Livré</p>
                      <p className="text-sm text-gray-500">
                        {order.orderStatus === 'delivered' 
                          ? `Livré le ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}` 
                          : 'En attente'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}

// Simple check icon component
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}