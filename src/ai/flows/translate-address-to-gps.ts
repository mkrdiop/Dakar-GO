// src/ai/flows/translate-address-to-gps.ts
'use server';

/**
 * @fileOverview This file contains a Genkit flow that translates a French address into GPS coordinates.
 *
 * - translateAddressToGPS - A function that translates a French address into GPS coordinates.
 * - TranslateAddressToGPSInput - The input type for the translateAddressToGPS function.
 * - TranslateAddressToGPSOutput - The return type for the translateAddressToGPS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAddressToGPSInputSchema = z.object({
  address: z.string().describe('The address in French to translate to GPS coordinates.'),
});
export type TranslateAddressToGPSInput = z.infer<typeof TranslateAddressToGPSInputSchema>;

const TranslateAddressToGPSOutputSchema = z.object({
  latitude: z.number().describe('The latitude of the address.'),
  longitude: z.number().describe('The longitude of the address.'),
});
export type TranslateAddressToGPSOutput = z.infer<typeof TranslateAddressToGPSOutputSchema>;

export async function translateAddressToGPS(input: TranslateAddressToGPSInput): Promise<TranslateAddressToGPSOutput> {
  return translateAddressToGPSFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateAddressToGPSPrompt',
  input: {schema: TranslateAddressToGPSInputSchema},
  output: {schema: TranslateAddressToGPSOutputSchema},
  prompt: `You are a geocoding expert. Your task is to convert a French address into GPS coordinates (latitude and longitude).

Address: {{{address}}}

Provide the latitude and longitude in the following JSON format:
{
  "latitude": <latitude>,
  "longitude": <longitude>
}`, // Ensure output is strictly a JSON object with latitude and longitude
});

const translateAddressToGPSFlow = ai.defineFlow(
  {
    name: 'translateAddressToGPSFlow',
    inputSchema: TranslateAddressToGPSInputSchema,
    outputSchema: TranslateAddressToGPSOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
