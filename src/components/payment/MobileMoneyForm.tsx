"use client";

import { MobileMoneyDetails } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Phone } from "lucide-react";

interface MobileMoneyFormProps {
  providerId: string;
  onDetailsChange: (details: MobileMoneyDetails) => void;
}

export function MobileMoneyForm({ providerId, onDetailsChange }: MobileMoneyFormProps) {
  const [details, setDetails] = useState<MobileMoneyDetails>({
    provider: providerId,
    phoneNumber: "",
    network: "orange", // Default
  });

  const handleInputChange = (field: keyof MobileMoneyDetails, value: string | any) => {
    // Format phone number
    if (field === "phoneNumber") {
      value = value.replace(/\D/g, "").substring(0, 9);
    }

    const updatedDetails = { ...details, [field]: value };
    setDetails(updatedDetails);
    onDetailsChange(updatedDetails);
  };

  // Determine provider name for display
  let providerName = "Mobile Money";
  if (providerId.includes("orange")) {
    providerName = "Orange Money";
  } else if (providerId.includes("wave")) {
    providerName = "Wave";
  } else if (providerId.includes("free")) {
    providerName = "Free Money";
  } else if (providerId.includes("expresso")) {
    providerName = "E-Money";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{providerName}</CardTitle>
        <CardDescription>
          Entrez votre numéro de téléphone pour le paiement mobile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phoneNumber"
              placeholder="77 123 45 67"
              className="pl-10"
              value={details.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Vous recevrez une notification sur ce numéro pour confirmer le paiement
          </p>
        </div>

        {/* Only show network selection for Orange Money */}
        {providerId.includes("orange") && (
          <div className="space-y-2">
            <Label>Réseau</Label>
            <RadioGroup
              value={details.network}
              onValueChange={(value) => handleInputChange("network", value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="orange"
                  id="orange"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="orange"
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Orange
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="free"
                  id="free"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="free"
                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Free
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex items-center text-xs text-muted-foreground mt-4">
          <p>
            En cliquant sur "Payer", vous acceptez de recevoir une notification de paiement sur votre téléphone.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}