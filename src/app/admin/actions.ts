'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { generateFruitImage } from '@/ai/flows/generate-fruit-image-flow';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addFruit(formData: FormData) {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const icon = formData.get('icon') as string;
  const hint = formData.get('hint') as string;

  if (!name || !price || !icon || !hint) {
    return { error: 'All fields are required.' };
  }

  let imageUrl: string;
  try {
    const result = await generateFruitImage({ description: hint });
    imageUrl = result.imageUrl;
  } catch (e: any) {
    console.warn(`AI image generation failed, using placeholder. Error: ${e.message}`);
    imageUrl = 'https://placehold.co/600x400.png';
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.from('fruits').insert([
      { name, price, icon, hint, image: imageUrl },
    ]);

    if (error) {
      console.error('Error adding fruit:', error);
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/');
  } catch (e: any) {
    console.error('Failed to add fruit to database:', e);
    return { error: `Operation failed: ${e.message}` };
  }
  
  redirect('/admin');
}

export async function deleteFruit(id: number) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from('fruits').delete().match({ id });

    if (error) {
        console.error('Error deleting fruit:', error);
        return { error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function updateFruitImage(id: number, imageUrl: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('fruits')
    .update({ image: imageUrl })
    .match({ id });

  if (error) {
    console.error('Error updating fruit image:', error);
    return { error: `Database error: ${error.message}` };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { error: null };
}
