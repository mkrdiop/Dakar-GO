"use client";

import { PaymentResponse, PaymentStatus as PaymentStatusType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

interface PaymentStatusProps {
  response: PaymentResponse;
  orderId: string;
  onClose?: () => void;
}

export function PaymentStatus({ response, orderId, onClose }: PaymentStatusProps) {
  const getStatusIcon = (status: PaymentStatusType) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-12 w-12 text-red-500" />;
      case "processing":
      case "pending":
        return <Clock className="h-12 w-12 text-amber-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getStatusTitle = (status: PaymentStatusType) => {
    switch (status) {
      case "completed":
        return "Paiement réussi";
      case "failed":
        return "Paiement échoué";
      case "processing":
        return "Paiement en cours";
      case "pending":
        return "Paiement en attente";
      default:
        return "Statut inconnu";
    }
  };

  const getStatusDescription = (status: PaymentStatusType, message: string) => {
    if (message) return message;
    
    switch (status) {
      case "completed":
        return "Votre paiement a été traité avec succès. Vous recevrez une confirmation par email.";
      case "failed":
        return "Votre paiement n'a pas pu être traité. Veuillez réessayer avec une autre méthode de paiement.";
      case "processing":
        return "Votre paiement est en cours de traitement. Veuillez patienter...";
      case "pending":
        return "Votre paiement est en attente de confirmation. Nous vous informerons dès qu'il sera traité.";
      default:
        return "Le statut de votre paiement est inconnu. Veuillez contacter le support.";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getStatusIcon(response.status)}
        </div>
        <CardTitle>{getStatusTitle(response.status)}</CardTitle>
        <CardDescription>
          {getStatusDescription(response.status, response.message)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {response.transactionId && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium">Référence de transaction:</p>
            <p className="font-mono">{response.transactionId}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {response.status === "completed" && (
          <>
            <Button className="w-full" asChild>
              <Link href={`/orders/${orderId}`}>
                <CheckCircle className="mr-2 h-4 w-4" /> Voir la commande
              </Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Télécharger le reçu
            </Button>
          </>
        )}

        {response.status === "failed" && (
          <>
            <Button className="w-full" onClick={onClose}>
              Réessayer
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/orders/${orderId}`}>
                Retour à la commande
              </Link>
            </Button>
          </>
        )}

        {(response.status === "processing" || response.status === "pending") && (
          <>
            {response.redirectUrl ? (
              <Button className="w-full" asChild>
                <Link href={response.redirectUrl}>
                  Continuer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button className="w-full" asChild>
                <Link href={`/orders/${orderId}`}>
                  <Clock className="mr-2 h-4 w-4" /> Suivre la commande
                </Link>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}