"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';
import TrackingMap from '@/components/core/TrackingMap';
import TrackingInfo from '@/components/core/TrackingInfo';
import { Order, DriverLocation } from '@/lib/types';
import { getOrderById, subscribeToDriverLocation } from '@/actions/tracking';

export default function TrackOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // In a real app, this would fetch from an API
        const orderData = await getOrderById(id as string);
        setOrder(orderData);
        setIsLoading(false);
      } catch (err) {
        setError('Impossible de charger les détails de la commande');
        setIsLoading(false);
      }
    };

    fetchOrderData();

    // Subscribe to driver location updates
    const unsubscribe = subscribeToDriverLocation(id as string, (location) => {
      setDriverLocation(location);
    });

    return () => {
      // Clean up subscription when component unmounts
      unsubscribe();
    };
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Chargement des informations de suivi...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !order) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-destructive/10 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-destructive mb-2">Erreur</h2>
            <p className="text-muted-foreground">{error || "Commande introuvable"}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Suivi de Livraison</h1>
        <p className="text-muted-foreground">Commande #{order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrackingMap order={order} driverLocation={driverLocation} />
        </div>
        <div>
          <TrackingInfo order={order} driverLocation={driverLocation} />
        </div>
      </div>
    </AppLayout>
  );
}