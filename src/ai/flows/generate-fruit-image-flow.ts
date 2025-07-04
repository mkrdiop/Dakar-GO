'use server';
/**
 * @fileOverview A flow to generate an image of a fruit.
 *
 * - generateFruitImage - A function that generates a fruit image.
 * - GenerateFruitImageInput - The input type for the generateFruitImage function.
 * - GenerateFruitImageOutput - The return type for the generateFruitImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFruitImageInputSchema = z.object({
  description: z.string().describe('A description of the fruit to generate an image for.'),
});
export type GenerateFruitImageInput = z.infer<typeof GenerateFruitImageInputSchema>;

const GenerateFruitImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateFruitImageOutput = z.infer<typeof GenerateFruitImageOutputSchema>;

export async function generateFruitImage(input: GenerateFruitImageInput): Promise<GenerateFruitImageOutput> {
    return generateFruitImageFlow(input);
}

const generateFruitImageFlow = ai.defineFlow(
  {
    name: 'generateFruitImageFlow',
    inputSchema: GenerateFruitImageInputSchema,
    outputSchema: GenerateFruitImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A photorealistic image of ${input.description}, on a clean white background, studio lighting.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Image generation failed.');
    }
    
    return { imageUrl: media.url };
  }
);
