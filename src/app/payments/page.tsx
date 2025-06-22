"use client";

import { useEffect, useState } from "react";
import { getPaymentTransactions } from "@/actions/payments";
import { PaymentTransaction } from "@/lib/types";
import { TransactionList } from "@/components/payment/TransactionList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const data = await getPaymentTransactions(user.id);
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user?.id]);

  // Calculate summary statistics
  const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const completedTransactions = transactions.filter(txn => txn.status === "completed");
  const pendingTransactions = transactions.filter(txn => txn.status === "pending" || txn.status === "processing");
  const failedTransactions = transactions.filter(txn => txn.status === "failed");

  const totalCompleted = completedTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalPending = pendingTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Paiements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total des paiements</CardTitle>
            <CardDescription>Montant total des transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
            <p className="text-sm text-muted-foreground">{transactions.length} transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paiements réussis</CardTitle>
            <CardDescription>Montant des paiements complétés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCompleted)}</p>
            <p className="text-sm text-muted-foreground">{completedTransactions.length} transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paiements en attente</CardTitle>
            <CardDescription>Montant des paiements en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
            <p className="text-sm text-muted-foreground">{pendingTransactions.length} transactions</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes ({transactions.length})</TabsTrigger>
          <TabsTrigger value="completed">Complétées ({completedTransactions.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({pendingTransactions.length})</TabsTrigger>
          <TabsTrigger value="failed">Échouées ({failedTransactions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TransactionList transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="completed">
          <TransactionList transactions={completedTransactions} />
        </TabsContent>
        
        <TabsContent value="pending">
          <TransactionList transactions={pendingTransactions} />
        </TabsContent>
        
        <TabsContent value="failed">
          <TransactionList transactions={failedTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}