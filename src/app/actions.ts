'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { Fruit } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createOrder(cartItems: Fruit[], phoneNumber: string, totalPrice: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const orderItems = cartItems.map(item => ({
    fruit_id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price
  }));

  const { data, error } = await supabase.from('orders').insert([
    { 
      phone_number: phoneNumber,
      total_price: totalPrice,
      items: orderItems,
      status: 'Pending'
    }
  ]).select().single();

  if (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Could not save your order. Please try again.' };
  }
  
  revalidatePath('/admin/orders');

  return { success: true, orderId: data.id };
}
