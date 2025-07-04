'use client';
import { useState } from 'react';
import type { Order, OrderItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"
import { updateOrderStatus } from '../actions';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

const formatCurrency = (amount: number) => {
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
  }).format(amount);
  return `${formattedAmount} FCFA`;
};

export function OrdersClient({ orders }: { orders: Order[] }) {
    const { toast } = useToast();

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        } else {
            toast({
                title: 'Success',
                description: `Order #${orderId} status updated to ${newStatus}.`,
            });
        }
    };

    return (
        <div className="border rounded-lg shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer Phone</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{format(new Date(order.created_at), 'Pp')}</TableCell>
                            <TableCell>{order.phone_number}</TableCell>
                            <TableCell>{formatCurrency(order.total_price)}</TableCell>
                            <TableCell>
                                <Select defaultValue={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                                    <SelectTrigger className={cn("w-[130px]", {
                                        "border-yellow-500 text-yellow-600": order.status === 'Pending',
                                        "border-green-500 text-green-600": order.status === 'Completed',
                                        "border-red-500 text-red-600": order.status === 'Cancelled'
                                    })}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="text-right">
                                <OrderDetailsDialog order={order} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {orders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function OrderDetailsDialog({ order }: { order: Order }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">View Details</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order #{order.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 my-4">
                    <p><strong>Date:</strong> {format(new Date(order.created_at), 'PPP p')}</p>
                    <p><strong>Customer:</strong> {order.phone_number}</p>
                    <p><strong>Total:</strong> {formatCurrency(order.total_price)}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Items</h4>
                        <div className="border rounded-md p-2 space-y-2 max-h-60 overflow-y-auto">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.quantity} kg &times; {formatCurrency(item.price)}</p>
                                    </div>
                                    <p className="font-semibold">{formatCurrency(item.quantity * item.price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
