
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VehicleSelector from "./VehicleSelector";
import type { VehicleType, CreateOrderFormData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { createOrderAction, getEstimatedDeliveryTimeAction } from "@/actions/orderActions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  pickupAddress: z.string().min(5, { message: "L'adresse de collecte doit comporter au moins 5 caractères." }),
  deliveryAddress: z.string().min(5, { message: "L'adresse de livraison doit comporter au moins 5 caractères." }),
  customerName: z.string().min(2, { message: "Le nom du client est requis." }),
  customerPhone: z.string().min(9, { message: "Le numéro de téléphone du client est requis (format local)." }),
  orderItems: z.string().min(3, { message: "Veuillez décrire les articles à livrer." }),
  vehicleType: z.enum(["scooter", "van", "truck", "car"], { required_error: "Veuillez sélectionner un type de véhicule." }),
  totalAmount: z.coerce.number().positive({ message: "Le montant total doit être un nombre positif." }),
  instructions: z.string().optional(),
});

export default function CreateOrderForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<{ time?: string; reasoning?: string; error?: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      customerName: "",
      customerPhone: "",
      orderItems: "",
      vehicleType: undefined, // Ensure it's undefined initially so placeholder/selection is clear
      totalAmount: 0,
      instructions: "",
    },
  });

  const handleEstimateTime = async () => {
    const pickupAddress = form.getValues("pickupAddress");
    const deliveryAddress = form.getValues("deliveryAddress");
    const vehicleType = form.getValues("vehicleType");
    const orderItems = form.getValues("orderItems");

    if (!pickupAddress || !deliveryAddress || !vehicleType || !orderItems) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir l'adresse de collecte, de livraison, les articles et sélectionner un véhicule pour estimer le délai.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEstimating(true);
    setEstimationResult(null);
    try {
      const result = await getEstimatedDeliveryTimeAction({
        pickupAddress,
        deliveryAddress,
        vehicleType,
        orderItems,
      });
      setEstimationResult({ time: result.estimatedTime, reasoning: result.reasoning, error: result.error });
      if(result.error){
         toast({ title: "Erreur d'estimation", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      setEstimationResult({ error: "Une erreur s'est produite lors de l'estimation." });
      toast({ title: "Erreur", description: "Impossible d'estimer le délai.", variant: "destructive" });
    } finally {
      setIsEstimating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createOrderAction(values as CreateOrderFormData);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Succès!",
        description: result.message,
      });
      router.push(`/orders/${result.orderId}`); // Navigate to the order details page
    } else {
      toast({
        title: "Erreur de création",
        description: result.message || "Une erreur est survenue.",
        variant: "destructive",
      });
      if (result.errors) {
        // Handle field-specific errors if needed, e.g., by setting form errors
        console.error("Validation errors:", result.errors);
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Nouvelle demande de livraison</CardTitle>
        <CardDescription>Remplissez les détails ci-dessous pour créer une nouvelle commande.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pickupAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de collecte</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123 Rue de Thies, Dakar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de livraison</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 456 Avenue Bourguiba, Dakar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom et Nom du client final" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du client</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Numéro du client final" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="orderItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Articles à livrer</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description des articles, ex: 1x Pizza, 2x Boissons" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de véhicule</FormLabel>
                  <FormControl>
                    <VehicleSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="button" variant="outline" onClick={handleEstimateTime} disabled={isEstimating} className="w-full sm:w-auto">
              {isEstimating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
              Estimer le délai de livraison (IA)
            </Button>

            {estimationResult && (
              <Alert variant={estimationResult.error ? "destructive" : "default"} className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>{estimationResult.error ? "Erreur d'estimation" : "Estimation du délai"}</AlertTitle>
                <AlertDescription>
                  {estimationResult.error ? estimationResult.error : 
                   `Temps estimé: ${estimationResult.time || 'N/A'}. Raison: ${estimationResult.reasoning || 'N/A'}`
                  }
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant total de la commande (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions spéciales (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Appeler avant d'arriver, laisser à la réception..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || isEstimating}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer la commande
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
