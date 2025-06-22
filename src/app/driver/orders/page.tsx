"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Order } from '@/lib/types';
import { MapPin, Navigation, Package, Clock, Search, Calendar } from 'lucide-react';
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
    id: 'dkr321', 
    customerName: 'Mamadou Seck', 
    customerPhone: '771122334', 
    pickupAddress: 'Ouakam', 
    deliveryAddress: 'Médina', 
    orderStatus: 'delivered', 
    orderItems: 'Colis électronique', 
    totalAmount: 4500, 
    vehicleType: 'scooter', 
    orderDate: new Date(Date.now() - 86400000 * 3),
    deliveryDate: new Date(Date.now() - 86400000 * 2.9),
    pickupLocation: { lat: 14.7345, lng: -17.4877 }, // Ouakam
    deliveryLocation: { lat: 14.6837, lng: -17.4441 }, // Médina
    driverId: 'driver001',
    driverName: 'Moussa Sow'
  },
  { 
    id: 'dkr654', 
    customerName: 'Fatou Ndiaye', 
    customerPhone: '781122334', 
    pickupAddress: 'Mermoz', 
    deliveryAddress: 'Ngor', 
    orderStatus: 'delivered', 
    orderItems: 'Vêtements', 
    totalAmount: 3500, 
    vehicleType: 'scooter', 
    orderDate: new Date(Date.now() - 86400000 * 4),
    deliveryDate: new Date(Date.now() - 86400000 * 3.9),
    pickupLocation: { lat: 14.7137, lng: -17.4841 }, // Mermoz
    deliveryLocation: { lat: 14.7471, lng: -17.5233 }, // Ngor
    driverId: 'driver001',
    driverName: 'Moussa Sow'
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

export default function DriverOrders() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [driverOrders, setDriverOrders] = useState<Order[]>([]);

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
        order => order.driverId === user.id
      );
      setDriverOrders(currentDriverOrders);
    }
  }, [user]);

  // Filter orders based on active tab and search query
  useEffect(() => {
    if (driverOrders.length > 0) {
      let filtered = [...driverOrders];
      
      // Filter by status
      if (activeTab === 'active') {
        filtered = filtered.filter(order => 
          ['accepted', 'picked_up', 'in_transit'].includes(order.orderStatus)
        );
      } else if (activeTab === 'completed') {
        filtered = filtered.filter(order => 
          order.orderStatus === 'delivered'
        );
      } else if (activeTab === 'cancelled') {
        filtered = filtered.filter(order => 
          ['cancelled', 'failed'].includes(order.orderStatus)
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.pickupAddress.toLowerCase().includes(query) ||
          order.deliveryAddress.toLowerCase().includes(query)
        );
      }
      
      setFilteredOrders(filtered);
    }
  }, [driverOrders, activeTab, searchQuery]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  return (
    <DriverLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Mes livraisons</h1>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une commande..."
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Actives</TabsTrigger>
            <TabsTrigger value="completed">Complétées</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">Aucune commande trouvée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <Card 
                    key={order.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/driver/orders/${order.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(order.orderDate!).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge className={statusMap[order.orderStatus].color}>
                          {statusMap[order.orderStatus].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-start space-x-2 mb-2">
                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Ramassage:</p>
                              <p className="text-sm text-gray-600">{order.pickupAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Navigation className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Livraison:</p>
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
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {order.estimatedDeliveryTime || 
                                (order.deliveryDate ? `Livré le ${new Date(order.deliveryDate).toLocaleDateString()}` : "Estimation non disponible")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
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