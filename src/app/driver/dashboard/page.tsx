"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order, Driver } from '@/lib/types';
import { MapPin, Navigation, Package, Clock, CheckCircle, XCircle, User, Phone, Truck } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import DriverLayout from '@/components/layout/DriverLayout';

// Mock orders for demonstration
const mockOrders: Order[] = [
  { 
    id: 'dkr123', 
    customerName: 'Aminata Fall', 
    customerPhone: '771234567', 
    pickupAddress: 'Yoff Virage', 
    deliveryAddress: 'Plateau, Rue 23', 
    orderStatus: 'accepted', 
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
  { 
    id: 'dkr101', 
    customerName: 'Omar Sall', 
    customerPhone: '771122334', 
    pickupAddress: 'Médina, Rue 11', 
    deliveryAddress: 'Mermoz, Villa 42', 
    orderStatus: 'pending', 
    orderItems: '2 Cartons de marchandises', 
    totalAmount: 4500, 
    vehicleType: 'scooter',
    orderDate: new Date(),
    pickupLocation: { lat: 14.6837, lng: -17.4441 }, // Médina
    deliveryLocation: { lat: 14.7137, lng: -17.4841 }, // Mermoz
  },
];

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

export default function DriverDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [driverOrders, setDriverOrders] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'driver'))) {
      router.push('/driver/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Load orders
  useEffect(() => {
    if (user) {
      // Filter orders for the current driver
      const currentDriverOrders = mockOrders.filter(
        order => order.driverId === user.id && order.orderStatus !== 'pending'
      );
      setDriverOrders(currentDriverOrders);

      // Filter available orders (pending orders that match the driver's vehicle type)
      const pendingOrders = mockOrders.filter(
        order => order.orderStatus === 'pending' && order.vehicleType === (user as Driver).vehicleType
      );
      setAvailableOrders(pendingOrders);
    }
  }, [user]);

  // Handle availability toggle
  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
    toast({
      title: checked ? "Vous êtes disponible" : "Vous êtes indisponible",
      description: checked 
        ? "Vous pouvez maintenant recevoir de nouvelles commandes" 
        : "Vous ne recevrez pas de nouvelles commandes",
    });
  };

  // Handle order acceptance
  const handleAcceptOrder = (orderId: string) => {
    // Update available orders
    setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
    
    // Find the order and update its status
    const acceptedOrder = mockOrders.find(order => order.id === orderId);
    if (acceptedOrder) {
      acceptedOrder.orderStatus = 'accepted';
      acceptedOrder.driverId = user?.id;
      acceptedOrder.driverName = `${user?.firstName} ${user?.lastName}`;
      
      // Add to driver orders
      setDriverOrders(prev => [...prev, acceptedOrder]);
      
      toast({
        title: "Commande acceptée",
        description: `Vous avez accepté la commande ${orderId}`,
      });
    }
  };

  // Handle order status update
  const handleUpdateStatus = (orderId: string, newStatus: 'picked_up' | 'in_transit' | 'delivered') => {
    setDriverOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, orderStatus: newStatus } 
          : order
      )
    );
    
    toast({
      title: "Statut mis à jour",
      description: `La commande ${orderId} est maintenant ${statusMap[newStatus].label.toLowerCase()}`,
    });
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  const driver = user as Driver;
  
  return (
    <DriverLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord chauffeur</h1>
            <p className="text-gray-600">
              Bienvenue, {driver.firstName} {driver.lastName}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch 
                id="availability" 
                checked={isAvailable} 
                onCheckedChange={handleAvailabilityChange} 
              />
              <Label htmlFor="availability">
                {isAvailable ? 'Disponible' : 'Indisponible'}
              </Label>
            </div>
            
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              {driver.rating} ★
            </Badge>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Informations chauffeur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span>ID: {driver.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-500" />
                <span>{driver.vehicleType.toUpperCase()} - {driver.vehiclePlate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <span>{driver.completedOrders} livraisons complétées</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Mes commandes</TabsTrigger>
            <TabsTrigger value="available">Commandes disponibles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-4">
            {driverOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Vous n'avez pas de commandes actives</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {driverOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                          <CardDescription>{new Date(order.orderDate!).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge className={statusMap[order.orderStatus].color}>
                          {statusMap[order.orderStatus].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start space-x-2 mb-2">
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
                          <div className="flex items-start space-x-2 mb-2">
                            <User className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Client:</p>
                              <p className="text-sm text-gray-600">{order.customerName} - {order.customerPhone}</p>
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
                    </CardContent>
                    <CardFooter className="flex flex-wrap justify-between gap-2 pt-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {order.estimatedDeliveryTime || "Estimation non disponible"}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {order.orderStatus === 'accepted' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'picked_up')}
                          >
                            Colis récupéré
                          </Button>
                        )}
                        {order.orderStatus === 'picked_up' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'in_transit')}
                          >
                            En route
                          </Button>
                        )}
                        {order.orderStatus === 'in_transit' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          >
                            Livré
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/driver/orders/${order.id}`)}
                        >
                          Détails
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="mt-4">
            {!isAvailable ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Vous êtes actuellement indisponible. Activez votre disponibilité pour voir les commandes.</p>
                </CardContent>
              </Card>
            ) : availableOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Aucune commande disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {availableOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                          <CardDescription>{new Date(order.orderDate!).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Disponible
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start space-x-2 mb-2">
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
                          <div className="flex items-start space-x-2 mb-2">
                            <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Colis:</p>
                              <p className="text-sm text-gray-600">{order.orderItems}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Truck className="h-5 w-5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {order.vehicleType.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="text-lg font-semibold">
                        {order.totalAmount} FCFA
                      </div>
                      <Button 
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        Accepter la commande
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DriverLayout>
  );
}