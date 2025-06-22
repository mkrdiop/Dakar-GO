"use client";

import { PaymentTransaction } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import Link from "next/link";

interface TransactionListProps {
  transactions: PaymentTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          Historique des transactions de paiement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Commande</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Aucune transaction trouvée
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.transactionDate), "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${transaction.orderId}`} className="text-primary hover:underline">
                      #{transaction.orderId}
                    </Link>
                  </TableCell>
                  <TableCell>{getPaymentMethodLabel(transaction.method)}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/payments/${transaction.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir</span>
                        </Link>
                      </Button>
                      {transaction.status === "completed" && (
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Télécharger</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}