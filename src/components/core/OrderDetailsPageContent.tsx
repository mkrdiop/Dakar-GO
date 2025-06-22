
"use client";
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MapPlaceholder from './MapPlaceholder';
import { Clock, Package, User, Phone, MapPin as MapPinIcon, Truck as TruckIcon, CheckCircle2, AlertTriangle, Info, Bike, CarFront, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Progress } from "@/components/ui/progress";
import { vehicleOptions } from '@/lib/types';

interface OrderDetailsPageContentProps {
  order: Order | null; // Allow null if order might not be found
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

const statusProgress: Record<Order['orderStatus'], number> = {
  pending: 10,
  accepted: 30,
  picked_up: 50,
  in_transit: 75,
  delivered: 100,
  cancelled: 0,
  failed: 0,
};

const getStatusVariant = (status?: Order['orderStatus']): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "secondary";
  switch (status) {
    case 'pending': return 'outline';
    case 'accepted':
    case 'picked_up': 
    case 'in_transit': return 'default';
    case 'delivered': return 'default'; // Success, primary is green
    case 'cancelled':
    case 'failed': return 'destructive';
    default: return 'secondary';
  }
};

const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'paid': return 'Payé';
    case 'failed': return 'Échec';
    case 'refunded': return 'Remboursé';
    default: return status;
  }
};

const getStatusIcon = (status?: Order['orderStatus']) => {
  if (!status) return <Package className="h-5 w-5" />;
  switch (status) {
    case 'pending': return <Clock className="h-5 w-5" />;
    case 'accepted': return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
    case 'picked_up': return <Package className="h-5 w-5 text-purple-500" />;
    case 'in_transit': return <TruckIcon className="h-5 w-5 text-orange-500" />;
    case 'delivered': return <CheckCircle2 className="h-5 w-5 text-primary" />;
    case 'cancelled':
    case 'failed': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    default: return <Package className="h-5 w-5" />;
  }
};

const vehicleIconMap: Record<string, React.ElementType> = {
  scooter: Bike,
  van: TruckIcon,
  truck: TruckIcon, // Potentially a different icon for heavy trucks if needed
  car: CarFront,
};

export default function OrderDetailsPageContent({ order }: OrderDetailsPageContentProps) {
  if (!order) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Commande non trouvée</h2>
        <p className="text-muted-foreground">Désolé, nous n'avons pas pu trouver les détails pour cette commande.</p>
      </div>
    );
  }

  const VehicleDisplayIcon = vehicleIconMap[order.vehicleType] || TruckIcon;
  const vehicleLabel = vehicleOptions.find(v => v.value === order.vehicleType)?.labelFr || order.vehicleType;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <CardTitle className="text-2xl font-bold text-primary">Détails de la Commande #{order.id.substring(0, 8)}</CardTitle>
            <Badge variant={getStatusVariant(order.orderStatus)} className="text-sm px-3 py-1 capitalize">
              {getStatusIcon(order.orderStatus)}
              <span className="ml-2">{statusTranslations[order.orderStatus] || order.orderStatus}</span>
            </Badge>
          </div>
          {order.orderDate && (
            <CardDescription>
              Commandé le: {new Date(order.orderDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Progression de la livraison</h3>
            <Progress value={statusProgress[order.orderStatus]} className="w-full h-3" />
            {order.estimatedDeliveryTime && order.orderStatus !== 'delivered' && (
              <p className="text-sm text-muted-foreground mt-2">
                <Clock className="inline h-4 w-4 mr-1" /> Délai de livraison estimé: {order.estimatedDeliveryTime}
              </p>
            )}
            {order.deliveryDate && order.orderStatus === 'delivered' && (
               <p className="text-sm text-green-600 font-medium mt-2">
                <CheckCircle2 className="inline h-4 w-4 mr-1" /> Livré le: {new Date(order.deliveryDate).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Informations Client</h4>
              <p className="flex items-center text-sm"><User className="h-4 w-4 mr-2 text-primary" /> {order.customerName}</p>
              <p className="flex items-center text-sm"><Phone className="h-4 w-4 mr-2 text-primary" /> {order.customerPhone}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Détails de la Livraison</h4>
              <p className="flex items-start text-sm">
                <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0" /> 
                <span className="font-medium">Collecte:</span>&nbsp;{order.pickupAddress}
              </p>
              <p className="flex items-start text-sm">
                <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0" /> 
                <span className="font-medium">Livraison:</span>&nbsp;{order.deliveryAddress}
              </p>
            </div>
          </div>
          
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Articles commandés</h4>
              <p className="text-sm bg-secondary/50 p-3 rounded-md">{order.orderItems}</p>
            </div>
             <div>
              <h4 className="font-semibold text-foreground mb-1">Véhicule</h4>
              <p className="flex items-center text-sm">
                <VehicleDisplayIcon className="h-5 w-5 mr-2 text-primary" /> {vehicleLabel}
              </p>
            </div>
          </div>

          {order.instructions && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Instructions spéciales</h4>
                <p className="text-sm bg-accent/10 p-3 rounded-md text-accent-foreground/80 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-accent shrink-0" />{order.instructions}
                </p>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-semibold text-foreground">Montant Total</h4>
              <p className="text-2xl font-bold text-primary">{order.totalAmount.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-xs text-muted-foreground mt-1">
                {order.paymentStatus ? `Statut: ${getPaymentStatusLabel(order.paymentStatus)}` : 'Paiement en attente'}
              </p>
            </div>
            
            {(!order.paymentStatus || order.paymentStatus === 'pending' || order.paymentStatus === 'failed') && (
              <Button asChild>
                <Link href={`/checkout/${order.id}`}>
                  <CreditCard className="mr-2 h-4 w-4" /> Payer maintenant
                </Link>
              </Button>
            )}
          </div>

        </CardContent>
        <CardFooter className="bg-muted/30 rounded-b-lg p-6">
          <p className="text-xs text-muted-foreground">
            Si vous avez des questions concernant votre commande, veuillez contacter notre support.
          </p>
        </CardFooter>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Suivi en temps réel</h3>
        <MapPlaceholder centerText="Localisation actuelle du livreur" />
      </div>
    </div>
  );
}
