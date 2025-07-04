import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { OrdersClient } from './orders-client';
import type { Order } from '@/types';

export default async function AdminOrdersPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <p className="text-destructive">Error loading orders: {error.message}</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Orders</h1>
            </div>
            <OrdersClient orders={orders as Order[]} />
        </div>
    );
}
