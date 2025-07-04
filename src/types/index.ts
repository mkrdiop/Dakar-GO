import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface Fruit {
  id: number;
  name: string;
  price: number;
  image: string;
  icon: string;
  quantity: number;
  hint: string;
}
