
// This will be a server component to fetch initial order data
import AppLayout from '@/components/layout/AppLayout';
import OrderDetailsPageContent from '@/components/core/OrderDetailsPageContent';
import type { Order } from '@/lib/types';

// Mock data fetching function - replace with actual data fetching logic (e.g., from Supabase)
async function getOrderById(id: string): Promise<Order | null> {
  console.log(`Fetching order with ID: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const mockOrders: Order[] = [
    { id: 'dkr123', customerName: 'Aminata Fall', customerPhone: '771234567', pickupAddress: 'Yoff Virage, En face de la mosquée', deliveryAddress: 'Plateau, Rue 23, Immeuble Sokhna', orderStatus: 'pending', orderItems: 'Documents importants (pochette A4 scellée)', totalAmount: 2500, vehicleType: 'scooter', orderDate: new Date(Date.now() - 86400000 * 0.2), instructions: "Remettre en mains propres à Mme. Diallo." },
    { id: 'dkr456', customerName: 'Moussa Diop', customerPhone: '781234567', pickupAddress: 'Sacré Coeur 3, Villa #12B', deliveryAddress: 'Almadies, Ngor, Près du supermarché Casino', orderStatus: 'in_transit', orderItems: 'Colis fragile (vase en céramique emballé)', totalAmount: 5000, vehicleType: 'van', orderDate: new Date(Date.now() - 86400000 * 1), estimatedDeliveryTime: 'Environ 35 minutes restantes', instructions: "Manipuler avec soin extrême. Éviter les chocs." },
    { id: 'dkr789', customerName: 'Aicha Ba', customerPhone: '761234567', pickupAddress: 'Liberté 6 Extension, Boulangerie Jaune', deliveryAddress: 'Fann Hock, Résidence Les Flamboyants, Apt 5C', orderStatus: 'delivered', orderItems: 'Repas chaud (Thieboudienne pour 2 personnes)', totalAmount: 3000, vehicleType: 'scooter', orderDate: new Date(Date.now() - 86400000 * 2), deliveryDate: new Date(Date.now() - 86400000 * 1.9) },
  ];
  
  const order = mockOrders.find(o => o.id === id);
  return order || null;
}

interface OrderDetailsPageProps {
  params: { id: string };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const order = await getOrderById(params.id);

  return (
    <AppLayout>
      <OrderDetailsPageContent order={order} />
    </AppLayout>
  );
}

export async function generateStaticParams() {
  // For demo purposes, pre-render a few mock order pages
  // In a real app, you might fetch popular orders or not use this if all are dynamic
  const mockOrderIds = ['dkr123', 'dkr456', 'dkr789'];
  return mockOrderIds.map(id => ({ id }));
}
