"use client";

import { useEffect, useState } from "react";
import { getPaymentTransaction, generatePaymentReceipt } from "@/actions/payments";
import { PaymentTransaction } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Download, Printer, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      try {
        const data = await getPaymentTransaction(params.id);
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [params.id]);

  const handleGenerateReceipt = async () => {
    if (!transaction) return;
    
    setIsGeneratingReceipt(true);
    try {
      const url = await generatePaymentReceipt(transaction.id);
      setReceiptUrl(url);
    } catch (error) {
      console.error("Error generating receipt:", error);
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Complété</Badge>;
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "processing":
        return <Badge variant="secondary">En cours</Badge>;
      case "failed":
        return <Badge variant="destructive">Échoué</Badge>;
      case "refunded":
        return <Badge variant="warning">Remboursé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "card":
        return "Carte bancaire";
      case "mobile_money":
        return "Mobile Money";
      case "cash":
        return "Espèces";
      case "bank_transfer":
        return "Virement bancaire";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction introuvable</h1>
        </div>
        
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              La transaction que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button asChild>
              <Link href="/payments">Retour aux paiements</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Détails de la transaction</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Transaction #{transaction.id}</CardTitle>
                  <CardDescription>
                    {format(new Date(transaction.transactionDate), "dd MMMM yyyy à HH:mm", { locale: fr })}
                  </CardDescription>
                </div>
                {getStatusBadge(transaction.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Détails de la transaction</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm">Référence</dt>
                      <dd className="text-sm font-medium">{transaction.transactionReference}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm">Méthode</dt>
                      <dd className="text-sm font-medium">{getPaymentMethodLabel(transaction.method)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm">Montant</dt>
                      <dd className="text-sm font-medium">{formatCurrency(transaction.amount)}</dd>
                    </div>
                    {transaction.fees && (
                      <div className="flex justify-between">
                        <dt className="text-sm">Frais</dt>
                        <dd className="text-sm font-medium">{formatCurrency(transaction.fees)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Détails de la commande</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm">Commande</dt>
                      <dd className="text-sm font-medium">
                        <Link href={`/orders/${transaction.orderId}`} className="text-primary hover:underline">
                          #{transaction.orderId}
                        </Link>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm">Description</dt>
                      <dd className="text-sm font-medium">{transaction.description}</dd>
                    </div>
                    {transaction.customerPhone && (
                      <div className="flex justify-between">
                        <dt className="text-sm">Téléphone client</dt>
                        <dd className="text-sm font-medium">{transaction.customerPhone}</dd>
                      </div>
                    )}
                    {transaction.customerEmail && (
                      <div className="flex justify-between">
                        <dt className="text-sm">Email client</dt>
                        <dd className="text-sm font-medium">{transaction.customerEmail}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              
              {transaction.gatewayResponse && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Réponse de la passerelle</h3>
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                      {JSON.stringify(transaction.gatewayResponse, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/payments">
                  Retour aux paiements
                </Link>
              </Button>
              
              <div className="flex gap-2">
                {transaction.status === "completed" && (
                  <>
                    <Button variant="outline" onClick={() => window.print()}>
                      <Printer className="mr-2 h-4 w-4" /> Imprimer
                    </Button>
                    <Button onClick={handleGenerateReceipt} disabled={isGeneratingReceipt}>
                      {isGeneratingReceipt ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Télécharger le reçu
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href={`/orders/${transaction.orderId}`}>
                  Voir la commande
                </Link>
              </Button>
              
              {transaction.status === "pending" && (
                <Button variant="outline" className="w-full">
                  Vérifier le statut
                </Button>
              )}
              
              {transaction.status === "failed" && (
                <Button variant="outline" className="w-full">
                  Réessayer le paiement
                </Button>
              )}
              
              {transaction.status === "completed" && !receiptUrl && (
                <Button variant="outline" className="w-full" onClick={handleGenerateReceipt} disabled={isGeneratingReceipt}>
                  {isGeneratingReceipt ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Générer un reçu
                </Button>
              )}
              
              {receiptUrl && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={receiptUrl} target="_blank">
                    <Download className="mr-2 h-4 w-4" /> Télécharger le reçu
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}