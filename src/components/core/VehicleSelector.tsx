
"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Bike, Truck, CarFront, Package } from "lucide-react";
import type { VehicleType } from "@/lib/types";
import { vehicleOptions } from "@/lib/types"; // Import vehicleOptions
import { cn } from "@/lib/utils";

interface VehicleSelectorProps {
  value: VehicleType | undefined;
  onChange: (value: VehicleType) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Bike,
  Truck,
  CarFront,
  Package, // Fallback
};

export default function VehicleSelector({ value, onChange }: VehicleSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val: VehicleType) => onChange(val)}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {vehicleOptions.map((option) => {
        const IconComponent = iconMap[option.icon] || Package;
        return (
          <Label
            key={option.value}
            htmlFor={`vehicle-${option.value}`}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-muted bg-popover hover:border-primary transition-all",
              value === option.value && "border-primary ring-2 ring-primary shadow-lg"
            )}
          >
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                <RadioGroupItem value={option.value} id={`vehicle-${option.value}`} className="sr-only" />
                <IconComponent className={cn("w-10 h-10 mb-2", value === option.value ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium text-center", value === option.value ? "text-primary" : "text-foreground")}>
                  {option.labelFr}
                </span>
              </CardContent>
            </Card>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
