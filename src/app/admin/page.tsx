import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteFruit, regenerateFruitImage } from './actions';
import Image from 'next/image';
import { format } from 'date-fns';

export default async function AdminPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: fruits, error } = await supabase.from('fruits').select('*').order('created_at', { ascending: false });

    if (error) {
        return <p className="text-destructive">Error loading fruits: {error.message}</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Fruits</h1>
                <Button asChild>
                    <Link href="/admin/new">Add New Fruit</Link>
                </Button>
            </div>
            <div className="border rounded-lg shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right w-[280px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fruits?.map(fruit => (
                            <TableRow key={fruit.id}>
                                <TableCell>
                                    <Image src={fruit.image.includes('placehold.co') ? 'https://placehold.co/40x40.png' : fruit.image} alt={fruit.name} width={40} height={40} className="rounded-md object-cover"/>
                                </TableCell>
                                <TableCell className="font-medium">{fruit.name}</TableCell>
                                <TableCell>{fruit.price} FCFA</TableCell>
                                <TableCell>{format(new Date(fruit.created_at), 'PPP')}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <form action={async () => {
                                            'use server';
                                            await regenerateFruitImage(fruit.id, fruit.hint);
                                        }}>
                                            <Button variant="outline" size="sm" type="submit">Regenerate Image</Button>
                                        </form>
                                        <form action={async () => {
                                            'use server';
                                            await deleteFruit(fruit.id);
                                        }}>
                                            <Button variant="destructive" size="sm" type="submit">Delete</Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                         {fruits?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No fruits found. Add your first fruit!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
