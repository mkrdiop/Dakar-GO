"use client";

import { PaymentMethod, PaymentProvider } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface PaymentMethodSelectorProps {
  providers: PaymentProvider[];
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod, providerId?: string) => void;
}

export function PaymentMethodSelector({
  providers,
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");

  const handleProviderSelect = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    if (provider) {
      setSelectedProviderId(providerId);
      
      // Map provider type to payment method
      let method: PaymentMethod;
      switch (provider.type) {
        case 'mobile_money':
          method = 'mobile_money';
          break;
        case 'card':
          method = 'card';
          break;
        case 'bank':
          method = 'bank_transfer';
          break;
        default:
          method = 'cash';
      }
      
      onMethodChange(method, providerId);
    }
  };

  // Group providers by type
  const mobileMoneyProviders = providers.filter(p => p.type === 'mobile_money' && p.isActive);
  const cardProviders = providers.filter(p => p.type === 'card' && p.isActive);
  const bankProviders = providers.filter(p => p.type === 'bank' && p.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Méthode de paiement</CardTitle>
        <CardDescription>
          Choisissez votre méthode de paiement préférée
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedProviderId}
          onValueChange={handleProviderSelect}
          className="space-y-6"
        >
          {/* Mobile Money Section */}
          {mobileMoneyProviders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Mobile Money
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mobileMoneyProviders.map((provider) => (
                  <div key={provider.id}>
                    <RadioGroupItem
                      value={provider.id}
                      id={provider.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={provider.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 h-12 w-12 relative">
                        <Image
                          src={provider.logo}
                          alt={provider.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">{provider.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Payment Section */}
          {cardProviders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Carte Bancaire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cardProviders.map((provider) => (
                  <div key={provider.id}>
                    <RadioGroupItem
                      value={provider.id}
                      id={provider.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={provider.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 h-12 w-12 relative">
                        <Image
                          src={provider.logo}
                          alt={provider.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">{provider.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Transfer Section */}
          {bankProviders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Virement Bancaire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {bankProviders.map((provider) => (
                  <div key={provider.id}>
                    <RadioGroupItem
                      value={provider.id}
                      id={provider.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={provider.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 h-12 w-12 relative">
                        <Image
                          src={provider.logo}
                          alt={provider.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">{provider.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cash Payment Option */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Paiement à la livraison
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <RadioGroupItem
                  value="cash-payment"
                  id="cash-payment"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="cash-payment"
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect width="18" height="12" x="3" y="6" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M3 10h18" />
                        <path d="M3 14h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Espèces</p>
                      <p className="text-xs text-muted-foreground">
                        Payer en espèces à la livraison
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}