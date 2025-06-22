"use client";

import { Order, PaymentMethod } from "@/lib/types";
import { calculatePaymentFees } from "@/actions/payments";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface PaymentSummaryProps {
  order: Order;
  paymentMethod: PaymentMethod;
}

export function PaymentSummary({ order, paymentMethod }: PaymentSummaryProps) {
  // Calculate fees based on payment method
  const fees = calculatePaymentFees(order.totalAmount, paymentMethod);
  const totalWithFees = order.totalAmount + fees;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif</CardTitle>
        <CardDescription>
          Détails de votre commande #{order.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Client</span>
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Téléphone</span>
            <span className="font-medium">{order.customerPhone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Adresse de livraison</span>
            <span className="font-medium">{order.deliveryAddress}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Articles</span>
            <span className="font-medium">{order.orderItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Véhicule</span>
            <span className="font-medium capitalize">{order.vehicleType}</span>
          </div>
          {order.instructions && (
            <div className="flex justify-between text-sm">
              <span>Instructions</span>
              <span className="font-medium">{order.instructions}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Frais de paiement</span>
            <span className="font-medium">{formatCurrency(fees)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 rounded-b-lg">
        <div className="flex justify-between w-full text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totalWithFees)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}