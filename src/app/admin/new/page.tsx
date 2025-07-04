'use client';
import { addFruit } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Adding Fruit...' : 'Add Fruit'}</Button>;
}

export default function NewFruitPage() {
    return (
        <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ChevronLeft className="w-4 h-4" />
                Back to all fruits
            </Link>
            <h1 className="text-3xl font-bold mb-6">Add New Fruit</h1>
            <form action={addFruit} className="max-w-xl space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Fruit Name</Label>
                    <Input id="name" name="name" type="text" required placeholder="e.g., Apple"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price (in FCFA)</Label>
                    <Input id="price" name="price" type="number" required placeholder="e.g., 1500"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon Name</Label>
                    <Input id="icon" name="icon" type="text" required placeholder="e.g., Apple, Banana, Cherry..." />
                    <p className="text-sm text-muted-foreground">Use a valid name from <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hint">Image Generation Hint</Label>
                    <Textarea id="hint" name="hint" required placeholder="A photorealistic image of fresh, ripe mangoes on a clean white background..." />
                    <p className="text-sm text-muted-foreground">A short, descriptive prompt for the AI to generate the product image.</p>
                </div>
                <SubmitButton />
            </form>
        </div>
    )
}
