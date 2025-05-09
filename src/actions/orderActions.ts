
"use server";
import { z } from "zod";
import { estimateDeliveryTime as estimateDeliveryTimeAI, type EstimateDeliveryTimeInput } from "@/ai/flows/estimate-delivery-time";
import type { CreateOrderFormData, VehicleType } from "@/lib/types";

const CreateOrderFormSchema = z.object({
  pickupAddress: z.string().min(5, "L'adresse de collecte est requise."),
  deliveryAddress: z.string().min(5, "L'adresse de livraison est requise."),
  customerName: z.string().min(2, "Le nom du client est requis."),
  customerPhone: z.string().min(9, "Le téléphone du client est requis."),
  orderItems: z.string().min(3, "Les articles de la commande sont requis."),
  vehicleType: z.enum(["scooter", "van", "truck", "car"]),
  totalAmount: z.number().positive("Le montant total doit être positif."),
  instructions: z.string().optional(),
});

// This function will be called by the CreateOrderForm component
export async function createOrderAction(formData: CreateOrderFormData) {
  const validatedFields = CreateOrderFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants ou invalides. Échec de la création de la commande.",
    };
  }

  // Simulate database insertion
  console.log("Order data to be saved:", validatedFields.data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate DB delay

  // This is a simplified representation. In a real app, you'd save to DB and get an ID.
  const orderId = Math.random().toString(36).substring(2, 15);

  return {
    success: true,
    message: "Commande créée avec succès!",
    orderId: orderId, // Return a mock order ID
  };
}


export async function getEstimatedDeliveryTimeAction(
  data: Omit<CreateOrderFormData, 'totalAmount' | 'customerName' | 'customerPhone' | 'instructions'>
): Promise<{ estimatedTime?: string; reasoning?: string; error?: string }> {
  
  const aiInput: EstimateDeliveryTimeInput = {
    pickupAddress: data.pickupAddress,
    deliveryAddress: data.deliveryAddress,
    vehicleType: data.vehicleType,
    orderItems: data.orderItems,
  };

  try {
    const result = await estimateDeliveryTimeAI(aiInput);
    return {
      estimatedTime: result.estimatedDeliveryTime,
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error("AI Error estimating delivery time:", error);
    return { error: "Impossible d'estimer le délai de livraison pour le moment." };
  }
}
