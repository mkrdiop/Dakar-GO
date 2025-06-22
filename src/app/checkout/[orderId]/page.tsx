"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPaymentProviders, processPayment } from "@/actions/payments";
import { 
  CardDetails, 
  MobileMoneyDetails, 
  Order, 
  PaymentMethod, 
  PaymentProvider, 
  PaymentRequest, 
  PaymentResponse 
} from "@/lib/types";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { CardPaymentForm } from "@/components/payment/CardPaymentForm";
import { MobileMoneyForm } from "@/components/payment/MobileMoneyForm";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { PaymentStatus } from "@/components/payment/PaymentStatus";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

// Mock order data - in a real app, this would be fetched from an API
const mockOrders: Record<string, Order> = {
  'dkr123': { 
    id: 'dkr123', 
    customerName: 'Aminata Fall', 
    customerPhone: '771234567', 
    pickupAddress: 'Yoff Virage', 
    deliveryAddress: 'Plateau, Rue 23', 
    orderStatus: 'pending', 
    orderItems: 'Documents importants', 
    totalAmount: 2500, 
    vehicleType: 'scooter', 
    orderDate: new Date() 
  },
  'dkr456': { 
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
    estimatedDeliveryTime: '35 minutes' 
  },
  'dkr789': { 
    id: 'dkr789', 
    customerName: 'Aicha Ba', 
    customerPhone: '761234567', 
    pickupAddress: ' liberté 6', 
    deliveryAddress: 'Fann Hock', 
    orderStatus: 'delivered', 
    orderItems: 'Repas chaud (Thieboudienne)', 
    totalAmount: 3000, 
    vehicleType: 'scooter', 
    orderDate: new Date(Date.now() - 86400000 * 2), 
    deliveryDate: new Date(Date.now() - 86400000 * 1.9) 
  }
};

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mobile_money');
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState<MobileMoneyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    // In a real app, fetch the order from an API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get order
        const orderData = mockOrders[params.orderId];
        if (orderData) {
          setOrder(orderData);
        }
        
        // Get payment providers
        const providersData = await getPaymentProviders();
        setProviders(providersData);
        
        // Set default provider if available
        if (providersData.length > 0) {
          const defaultProvider = providersData.find(p => p.type === 'mobile_money') || providersData[0];
          setSelectedProviderId(defaultProvider.id);
          
          // Map provider type to payment method
          if (defaultProvider.type === 'mobile_money') {
            setSelectedMethod('mobile_money');
          } else if (defaultProvider.type === 'card') {
            setSelectedMethod('card');
          } else if (defaultProvider.type === 'bank') {
            setSelectedMethod('bank_transfer');
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.orderId]);

  const handleMethodChange = (method: PaymentMethod, providerId?: string) => {
    setSelectedMethod(method);
    if (providerId) {
      setSelectedProviderId(providerId);
    }
    
    // Reset form data when changing method
    if (method !== 'card') {
      setCardDetails(null);
    }
    if (method !== 'mobile_money') {
      setMobileMoneyDetails(null);
    }
  };

  const handleCardDetailsChange = (details: CardDetails) => {
    setCardDetails(details);
  };

  const handleMobileMoneyDetailsChange = (details: MobileMoneyDetails) => {
    setMobileMoneyDetails(details);
  };

  const handlePayment = async () => {
    if (!order || !user) return;
    
    setIsProcessing(true);
    
    try {
      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'XOF',
        method: selectedMethod,
        customerEmail: user.email || '',
        customerPhone: order.customerPhone,
        description: `Paiement pour livraison #${order.id}`,
      };
      
      // Add method-specific details
      if (selectedMethod === 'card' && cardDetails) {
        paymentRequest.cardDetails = cardDetails;
      } else if (selectedMethod === 'mobile_money' && mobileMoneyDetails) {
        paymentRequest.mobileMoneyDetails = mobileMoneyDetails;
      }
      
      // Process payment
      const response = await processPayment(paymentRequest);
      setPaymentResponse(response);
      
      // If payment requires redirect, handle it
      if (response.redirectUrl) {
        // In a real app, this would redirect to the payment gateway
        // For demo, we'll just simulate a delay
        setTimeout(() => {
          router.push(response.redirectUrl!);
        }, 2000);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentResponse({
        success: false,
        status: 'failed',
        message: 'Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPayment = () => {
    setPaymentResponse(null);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
          <p className="text-muted-foreground mb-6">
            La commande que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button asChild>
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If we have a payment response, show the status
  if (paymentResponse) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <PaymentStatus 
          response={paymentResponse} 
          orderId={order.id} 
          onClose={resetPayment} 
        />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/orders/${order.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Paiement de la commande</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PaymentMethodSelector 
            providers={providers}
            selectedMethod={selectedMethod}
            onMethodChange={handleMethodChange}
          />
          
          {selectedMethod === 'card' && (
            <CardPaymentForm onCardDetailsChange={handleCardDetailsChange} />
          )}
          
          {selectedMethod === 'mobile_money' && selectedProviderId && (
            <MobileMoneyForm 
              providerId={selectedProviderId}
              onDetailsChange={handleMobileMoneyDetailsChange}
            />
          )}
          
          <Button 
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing || (
              (selectedMethod === 'card' && !cardDetails) || 
              (selectedMethod === 'mobile_money' && !mobileMoneyDetails)
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Payer maintenant
              </>
            )}
          </Button>
        </div>
        
        <div>
          <PaymentSummary order={order} paymentMethod={selectedMethod} />
        </div>
      </div>
    </div>
  );
}