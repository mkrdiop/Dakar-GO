
"use client";
import AppLayout from '@/components/layout/AppLayout';
import OrderCard from '@/components/core/OrderCard';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ListFilter, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for orders - replace with actual data fetching
const mockOrders: Order[] = [
  { id: 'dkr123', customerName: 'Aminata Fall', customerPhone: '771234567', pickupAddress: 'Yoff Virage', deliveryAddress: 'Plateau, Rue 23', orderStatus: 'pending', orderItems: 'Documents importants', totalAmount: 2500, vehicleType: 'scooter', orderDate: new Date() },
  { id: 'dkr456', customerName: 'Moussa Diop', customerPhone: '781234567', pickupAddress: 'Sacré Coeur 3', deliveryAddress: 'Almadies, Ngor', orderStatus: 'in_transit', orderItems: 'Colis fragile (vase)', totalAmount: 5000, vehicleType: 'van', orderDate: new Date(Date.now() - 86400000 * 1), estimatedDeliveryTime: '35 minutes' },
  { id: 'dkr789', customerName: 'Aicha Ba', customerPhone: '761234567', pickupAddress: ' liberté 6', deliveryAddress: 'Fann Hock', orderStatus: 'delivered', orderItems: 'Repas chaud (Thieboudienne)', totalAmount: 3000, vehicleType: 'scooter', orderDate: new Date(Date.now() - 86400000 * 2), deliveryDate: new Date(Date.now() - 86400000 * 1.9) },
  { id: 'dkr101', customerName: 'Omar Sylla', customerPhone: '701234567', pickupAddress: 'Parcelles Assainies U20', deliveryAddress: 'Point E', orderStatus: 'accepted', orderItems: 'Courses (légumes, fruits)', totalAmount: 7500, vehicleType: 'car', orderDate: new Date(Date.now() - 86400000 * 0.5)},
  { id: 'dkr112', customerName: 'Fatou Gueye', customerPhone: '751234567', pickupAddress: 'Grand Yoff', deliveryAddress: 'Mermoz', orderStatus: 'cancelled', orderItems: 'Livres scolaires', totalAmount: 4000, vehicleType: 'truck', orderDate: new Date(Date.now() - 86400000 * 3)},
];

type StatusFilter = Order['orderStatus'] | 'all';

export default function DashboardPage() {
  // In a real app, fetch orders:
  // const { data: orders, isLoading, error } = useQuery('orders', fetchOrdersFunction);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilters, setStatusFilters] = useState<Record<Order['orderStatus'], boolean>>({
    pending: true,
    accepted: true,
    picked_up: true,
    in_transit: true,
    delivered: false, // Initially hide delivered
    cancelled: false, // Initially hide cancelled
    failed: false, // Initially hide failed
  });


  useEffect(() => {
    // Simulate fetching orders
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const toggleFilter = (status: Order['orderStatus']) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const filteredOrders = orders.filter(order => statusFilters[order.orderStatus]);


  if (isLoading) {
    return <AppLayout><div className="text-center py-10">Chargement des commandes...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Marchand</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" /> Filtrer Statut
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Afficher les commandes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(statusFilters) as Array<Order['orderStatus']>).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilters[status]}
                  onCheckedChange={() => toggleFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/create-order" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Commande
            </Button>
          </Link>
        </div>
      </div>

      {filteredOrders.length === 0 && !isLoading ? (
        <div className="text-center py-10 bg-card rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">Aucune commande à afficher.</p>
          <p className="text-sm text-muted-foreground">Créez votre première commande pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
