
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, MapPin, Package, CalendarDays, Clock, AlertTriangle, CheckCircle2, Truck as TruckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { vehicleOptions } from '@/lib/types';

interface OrderCardProps {
  order: Order;
}

const getStatusVariant = (status: Order['orderStatus']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pending': return 'outline';
    case 'accepted':
    case 'picked_up':
    case 'in_transit': return 'default'; // Or a specific color for in_transit like blue if themable
    case 'delivered': return 'default'; // Success, could be green if primary is not green
    case 'cancelled':
    case 'failed': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: Order['orderStatus']) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4 mr-1" />;
    case 'accepted': return <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />;
    case 'picked_up': return <Package className="h-4 w-4 mr-1" />;
    case 'in_transit': return <TruckIcon className="h-4 w-4 mr-1 text-blue-500" />;
    case 'delivered': return <CheckCircle2 className="h-4 w-4 mr-1 text-primary" />;
    case 'cancelled':
    case 'failed': return <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />;
    default: return <Package className="h-4 w-4 mr-1" />;
  }
}

const statusTranslations: Record<Order['orderStatus'], string> = {
  pending: "En attente",
  accepted: "Acceptée",
  picked_up: "Collectée",
  in_transit: "En transit",
  delivered: "Livrée",
  cancelled: "Annulée",
  failed: "Échouée",
};


export default function OrderCard({ order }: OrderCardProps) {
  const vehicle = vehicleOptions.find(v => v.value === order.vehicleType);
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-primary">Commande #{order.id.substring(0, 8)}</CardTitle>
          <Badge variant={getStatusVariant(order.orderStatus)} className="capitalize">
            {getStatusIcon(order.orderStatus)}
            {statusTranslations[order.orderStatus] || order.orderStatus}
          </Badge>
        </div>
        <CardDescription>Pour: {order.customerName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-accent" />
          <span>{order.deliveryAddress}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Package className="h-4 w-4 mr-2 text-accent" />
          <span>{order.orderItems}</span>
        </div>
        {order.orderDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2 text-accent" />
            <span>Commandé le: {new Date(order.orderDate).toLocaleDateString('fr-FR')}</span>
          </div>
        )}
         {vehicle && (
          <div className="flex items-center text-sm text-muted-foreground">
            {/* Placeholder for vehicle icon */}
            <TruckIcon className="h-4 w-4 mr-2 text-accent" /> 
            <span>Véhicule: {vehicle.labelFr}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link href={`/orders/${order.id}`} passHref legacyBehavior>
          <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
            Voir les détails <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
