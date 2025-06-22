'use server';

import { 
  PaymentMethod, 
  PaymentProvider, 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus, 
  PaymentTransaction 
} from '@/lib/types';

// Mock payment providers
const mockPaymentProviders: PaymentProvider[] = [
  {
    id: 'wave-senegal',
    name: 'Wave',
    logo: '/images/payment/wave.png',
    type: 'mobile_money',
    isActive: true
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    logo: '/images/payment/orange-money.png',
    type: 'mobile_money',
    isActive: true
  },
  {
    id: 'free-money',
    name: 'Free Money',
    logo: '/images/payment/free-money.png',
    type: 'mobile_money',
    isActive: true
  },
  {
    id: 'visa-mastercard',
    name: 'Visa/Mastercard',
    logo: '/images/payment/card.png',
    type: 'card',
    isActive: true
  },
  {
    id: 'bank-transfer',
    name: 'Virement Bancaire',
    logo: '/images/payment/bank.png',
    type: 'bank',
    isActive: true
  }
];

// Mock transactions for demo
const mockTransactions: PaymentTransaction[] = [
  {
    id: 'txn-001',
    orderId: 'dkr123',
    amount: 2500,
    currency: 'XOF',
    method: 'mobile_money',
    status: 'completed',
    transactionDate: new Date(Date.now() - 86400000 * 2),
    transactionReference: 'WV-12345678',
    customerPhone: '771234567',
    merchantId: 'merchant-001',
    description: 'Paiement pour livraison #dkr123'
  },
  {
    id: 'txn-002',
    orderId: 'dkr456',
    amount: 5000,
    currency: 'XOF',
    method: 'card',
    status: 'completed',
    transactionDate: new Date(Date.now() - 86400000 * 1),
    transactionReference: 'CARD-87654321',
    customerEmail: 'client@example.com',
    merchantId: 'merchant-001',
    description: 'Paiement pour livraison #dkr456',
    fees: 150
  },
  {
    id: 'txn-003',
    orderId: 'dkr789',
    amount: 3000,
    currency: 'XOF',
    method: 'cash',
    status: 'completed',
    transactionDate: new Date(Date.now() - 86400000 * 1.5),
    transactionReference: 'CASH-00123',
    customerPhone: '761234567',
    merchantId: 'merchant-001',
    description: 'Paiement en espèces pour livraison #dkr789'
  },
  {
    id: 'txn-004',
    orderId: 'dkr101',
    amount: 7500,
    currency: 'XOF',
    method: 'mobile_money',
    status: 'pending',
    transactionDate: new Date(),
    transactionReference: 'OM-98765432',
    customerPhone: '701234567',
    merchantId: 'merchant-001',
    description: 'Paiement en attente pour livraison #dkr101'
  },
  {
    id: 'txn-005',
    orderId: 'dkr112',
    amount: 4000,
    currency: 'XOF',
    method: 'bank_transfer',
    status: 'failed',
    transactionDate: new Date(Date.now() - 86400000 * 3),
    transactionReference: 'BNK-45678901',
    customerEmail: 'client2@example.com',
    merchantId: 'merchant-001',
    description: 'Paiement échoué pour livraison #dkr112'
  }
];

/**
 * Get all available payment providers
 */
export async function getPaymentProviders(): Promise<PaymentProvider[]> {
  // In a real app, this would fetch from an API or database
  return mockPaymentProviders;
}

/**
 * Get payment transactions for a merchant
 */
export async function getPaymentTransactions(merchantId: string): Promise<PaymentTransaction[]> {
  // In a real app, this would fetch from an API or database
  return mockTransactions.filter(txn => txn.merchantId === merchantId);
}

/**
 * Get a specific payment transaction by ID
 */
export async function getPaymentTransaction(transactionId: string): Promise<PaymentTransaction | null> {
  // In a real app, this would fetch from an API or database
  const transaction = mockTransactions.find(txn => txn.id === transactionId);
  return transaction || null;
}

/**
 * Process a payment request
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would call a payment gateway API
  
  // Simulate different payment outcomes based on amount for demo purposes
  const testAmount = request.amount % 1000;
  
  if (testAmount < 200) {
    // Simulate a failed payment
    return {
      success: false,
      status: 'failed',
      message: 'Le paiement a échoué. Veuillez réessayer avec une autre méthode de paiement.'
    };
  } else if (testAmount < 500) {
    // Simulate a payment requiring redirect
    return {
      success: true,
      transactionId: `txn-${Date.now()}`,
      status: 'processing',
      message: 'Redirection vers la page de paiement...',
      redirectUrl: `/payment/redirect?txn=${Date.now()}&provider=${request.method}`,
      gatewayReference: `REF-${Date.now()}`
    };
  } else {
    // Simulate a successful payment
    return {
      success: true,
      transactionId: `txn-${Date.now()}`,
      status: 'completed',
      message: 'Paiement effectué avec succès!',
      gatewayReference: `REF-${Date.now()}`
    };
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  transactionId: string, 
  newStatus: PaymentStatus
): Promise<PaymentTransaction | null> {
  // In a real app, this would update the database
  
  // For demo, we'll just return a mock updated transaction
  return {
    id: transactionId,
    orderId: 'dkr-updated',
    amount: 5000,
    currency: 'XOF',
    method: 'mobile_money',
    status: newStatus,
    transactionDate: new Date(),
    transactionReference: `REF-${Date.now()}`,
    customerPhone: '771234567',
    merchantId: 'merchant-001',
    description: 'Statut de paiement mis à jour'
  };
}

/**
 * Generate payment receipt
 */
export async function generatePaymentReceipt(transactionId: string): Promise<string> {
  // In a real app, this would generate a PDF receipt
  
  // For demo, we'll just return a mock receipt URL
  return `/receipts/${transactionId}.pdf`;
}

/**
 * Calculate payment fees
 */
export function calculatePaymentFees(amount: number, method: PaymentMethod): number {
  // Calculate fees based on payment method
  switch (method) {
    case 'card':
      // 3% for card payments
      return Math.round(amount * 0.03);
    case 'mobile_money':
      // 1.5% for mobile money
      return Math.round(amount * 0.015);
    case 'bank_transfer':
      // Fixed fee for bank transfers
      return 500;
    case 'cash':
      // No fees for cash
      return 0;
    default:
      return 0;
  }
}