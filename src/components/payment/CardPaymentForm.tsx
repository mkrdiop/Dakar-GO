"use client";

import { CardDetails } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, User, Lock } from "lucide-react";

interface CardPaymentFormProps {
  onCardDetailsChange: (details: CardDetails) => void;
}

export function CardPaymentForm({ onCardDetailsChange }: CardPaymentFormProps) {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    // Format card number with spaces
    if (field === "cardNumber") {
      value = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      value = value.substring(0, 19); // 16 digits + 3 spaces
    }

    // Limit CVV to 3-4 digits
    if (field === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 4);
    }

    // Limit month to 2 digits and valid values (01-12)
    if (field === "expiryMonth") {
      value = value.replace(/\D/g, "").substring(0, 2);
      const monthNum = parseInt(value);
      if (monthNum > 12) value = "12";
    }

    // Limit year to 2 digits
    if (field === "expiryYear") {
      value = value.replace(/\D/g, "").substring(0, 2);
    }

    const updatedDetails = { ...cardDetails, [field]: value };
    setCardDetails(updatedDetails);
    onCardDetailsChange(updatedDetails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la carte</CardTitle>
        <CardDescription>
          Entrez les informations de votre carte bancaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Numéro de carte</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="pl-10"
              value={cardDetails.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Nom du titulaire</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="cardholderName"
              placeholder="JOHN DOE"
              className="pl-10"
              value={cardDetails.cardholderName}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryMonth">Mois</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="expiryMonth"
                placeholder="MM"
                className="pl-10"
                value={cardDetails.expiryMonth}
                onChange={(e) => handleInputChange("expiryMonth", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryYear">Année</Label>
            <Input
              id="expiryYear"
              placeholder="YY"
              value={cardDetails.expiryYear}
              onChange={(e) => handleInputChange("expiryYear", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                className="pl-10"
                value={cardDetails.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex gap-2">
            <span>Visa</span>
            <span>Mastercard</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}