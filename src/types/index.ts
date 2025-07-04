import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface Fruit {
  id: number;
  created_at: string;
  name: string;
  price: number;
  image: string;
  icon: string;
  quantity: number;
  hint: string;
}

export interface OrderItem {
  fruit_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  created_at: string;
  phone_number: string;
  total_price: number;
  items: OrderItem[];
  status: 'Pending' | 'Completed' | 'Cancelled';
}
