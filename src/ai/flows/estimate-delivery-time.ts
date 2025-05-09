// 'use server'
'use server';

/**
 * @fileOverview A delivery time estimation AI agent.
 *
 * - estimateDeliveryTime - A function that estimates the delivery time.
 * - EstimateDeliveryTimeInput - The input type for the estimateDeliveryTime function.
 * - EstimateDeliveryTimeOutput - The return type for the estimateDeliveryTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VehicleTypeEnum = z.enum(['scooter', 'van', 'truck', 'car']);

const EstimateDeliveryTimeInputSchema = z.object({
  pickupAddress: z.string().describe('The pickup address in Dakar.'),
  deliveryAddress: z.string().describe('The delivery address in Dakar.'),
  vehicleType: VehicleTypeEnum.describe('The type of vehicle to use for delivery.'),
  orderItems: z.string().describe('The order items'),
});
export type EstimateDeliveryTimeInput = z.infer<typeof EstimateDeliveryTimeInputSchema>;

const EstimateDeliveryTimeOutputSchema = z.object({
  estimatedDeliveryTime: z.string().describe('The estimated delivery time in minutes.'),
  reasoning: z.string().describe('The reasoning behind the estimated delivery time.'),
});
export type EstimateDeliveryTimeOutput = z.infer<typeof EstimateDeliveryTimeOutputSchema>;

export async function estimateDeliveryTime(input: EstimateDeliveryTimeInput): Promise<EstimateDeliveryTimeOutput> {
  return estimateDeliveryTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateDeliveryTimePrompt',
  input: {schema: EstimateDeliveryTimeInputSchema},
  output: {schema: EstimateDeliveryTimeOutputSchema},
  prompt: `You are a delivery time estimation expert for Dakar, Senegal.

  Given the following information, estimate the delivery time in minutes:

  Pickup Address: {{{pickupAddress}}}
  Delivery Address: {{{deliveryAddress}}}
  Vehicle Type: {{{vehicleType}}}
  Order Items: {{{orderItems}}}

  Consider real-time traffic conditions in Dakar when estimating the delivery time.

  Format your response as follows:
  Estimated Delivery Time: <estimated_delivery_time_in_minutes>
  Reasoning: <reasoning_behind_the_estimated_delivery_time>
  `,
});

const estimateDeliveryTimeFlow = ai.defineFlow(
  {
    name: 'estimateDeliveryTimeFlow',
    inputSchema: EstimateDeliveryTimeInputSchema,
    outputSchema: EstimateDeliveryTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

