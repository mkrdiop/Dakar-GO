'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Apple, Banana, Cherry, Citrus, Grape, Leaf, Minus, Plus, ShoppingCart, Package } from 'lucide-react';
import type { Fruit } from '@/types';
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton';
import { generateFruitImage } from '@/ai/flows/generate-fruit-image-flow';

// Data for our fruits
const initialFruits: Fruit[] = [
  { id: 1, name: 'Pommes', price: 1500, image: 'https://placehold.co/600x400.png', icon: Apple, quantity: 0, hint: 'red apples' },
  { id: 2, name: 'Bananes', price: 1200, image: 'https://placehold.co/600x400.png', icon: Banana, quantity: 0, hint: 'yellow bananas' },
  { id: 3, name: 'Oranges', price: 1800, image: 'https://placehold.co/600x400.png', icon: Citrus, quantity: 0, hint: 'fresh oranges' },
  { id: 4, name: 'Raisins', price: 2500, image: 'https://placehold.co/600x400.png', icon: Grape, quantity: 0, hint: 'purple grapes' },
  { id: 5, name: 'Ananas', price: 2000, image: 'https://placehold.co/600x400.png', icon: Leaf, quantity: 0, hint: 'pineapple fruit' },
  { id: 6, name: 'Cerises', price: 3500, image: 'https://placehold.co/600x400.png', icon: Cherry, quantity: 0, hint: 'red cherries' },
  { id: 7, name: 'Fraises', price: 4000, image: 'https://placehold.co/600x400.png', icon: Leaf, quantity: 0, hint: 'fresh strawberries' },
  { id: 8, name: 'Mangues', price: 2200, image: 'https://placehold.co/600x400.png', icon: Leaf, quantity: 0, hint: 'ripe mangoes' },
  { id: 9, name: 'Pêches', price: 2800, image: 'https://placehold.co/600x400.png', icon: Leaf, quantity: 0, hint: 'sweet peaches' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

function FructiMarchePageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-8 px-4 sm:px-8">
        <div className="container mx-auto flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-80" />
          </div>
        </div>
      </header>
      <main className="flex-grow p-4 sm:p-8 pt-0">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-40">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="flex justify-center items-center gap-4 bg-muted/50 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function FructiMarchePage() {
  const [fruits, setFruits] = useState<Fruit[]>(initialFruits);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false);
  const [areImagesLoading, setAreImagesLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    const fetchImages = async () => {
      try {
        const imagePromises = initialFruits.map(fruit => 
          generateFruitImage({ description: fruit.hint })
        );
        const generatedImages = await Promise.all(imagePromises);
        
        const updatedFruits = initialFruits.map((fruit, index) => ({
          ...fruit,
          image: generatedImages[index].imageUrl,
        }));
        
        setFruits(updatedFruits);
      } catch (error) {
        console.error("Failed to generate fruit images:", error);
        toast({
          variant: 'destructive',
          title: 'Erreur de génération d\'image',
          description: 'Impossible de charger les images des fruits. Veuillez réessayer plus tard.',
        });
      } finally {
        setAreImagesLoading(false);
      }
    };
    
    fetchImages();
  }, [toast]);

  const handleQuantityChange = (fruitId: number, change: number) => {
    setFruits(prevFruits =>
      prevFruits.map(fruit =>
        fruit.id === fruitId
          ? { ...fruit, quantity: Math.max(0, fruit.quantity + change) }
          : fruit
      )
    );
  };
  
  const cartItems = useMemo(() => fruits.filter(fruit => fruit.quantity > 0), [fruits]);
  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);
  const totalItems = useMemo(() => cartItems.length, [cartItems]);
  
  const handlePayment = () => {
    toast({
      title: "Paiement réussi!",
      description: "Merci pour votre achat. Votre commande a été passée.",
    });
    setIsCartOpen(false);
    setFruits(initialFruits.map(f => ({...f, quantity: 0})));
  }

  if (!isClient) {
    return <FructiMarchePageSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-8 px-4 sm:px-8">
        <div className="container mx-auto flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-full">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary-foreground">FructiMarché</h1>
            <p className="text-muted-foreground">Votre marché de fruits frais en ligne.</p>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-8 pt-0">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-40">
          {fruits.map(fruit => (
            <Card key={fruit.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative w-full h-48">
                 {areImagesLoading ? (
                    <Skeleton className="h-full w-full" />
                 ) : (
                    <Image src={fruit.image} alt={fruit.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={fruit.hint} />
                 )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                  <fruit.icon className="w-6 h-6 text-primary" />
                  {fruit.name}
                </CardTitle>
                <CardDescription className="text-xl font-semibold text-accent">
                  {isClient ? formatCurrency(fruit.price) : <Skeleton className="h-6 w-24" />} / kg
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="flex justify-center items-center gap-4 bg-muted/50 p-4">
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10" onClick={() => handleQuantityChange(fruit.id, -1)} disabled={fruit.quantity === 0}>
                  <Minus className="w-5 h-5" />
                </Button>
                <span className="text-2xl font-bold w-16 text-center tabular-nums">{fruit.quantity}</span>
                <Button variant="default" size="icon" className="rounded-full w-10 h-10" onClick={() => handleQuantityChange(fruit.id, 1)}>
                  <Plus className="w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {totalItems > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t p-4 shadow-top-lg animate-in slide-in-from-bottom-full duration-500">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{totalItems} type{totalItems > 1 ? 's' : ''} de fruit{totalItems > 1 ? 's' : ''} dans le panier</p>
              <p className="text-2xl font-headline font-bold text-primary">{formatCurrency(totalPrice)}</p>
            </div>
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="font-bold text-lg py-6 px-8 shadow-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Acheter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">Votre Panier</DialogTitle>
                  <DialogDescription>
                    Vérifiez votre commande avant de continuer.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto my-4 -mr-6 pr-6">
                  <div className="grid gap-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2 rounded-md">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.quantity} kg &times; {formatCurrency(item.price)}</p>
                          </div>
                        </div>
                        <p className="font-bold tabular-nums">{formatCurrency(item.quantity * item.price)}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <p>Total</p>
                      <p className="text-primary">{formatCurrency(totalPrice)}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsCartOpen(false)}>Continuer les achats</Button>
                  <Button type="submit" size="lg" onClick={handlePayment}>
                    Payer {formatCurrency(totalPrice)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </footer>
      )}
    </div>
  );
}
