"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import Image from 'next/image';
import { Driver } from '@/lib/types';

// Mock driver data for demonstration
const mockDrivers: Driver[] = [
  {
    id: 'driver001',
    email: 'moussa.sow@dakar.go',
    firstName: 'Moussa',
    lastName: 'Sow',
    role: 'driver',
    phone: '771234567',
    vehicleType: 'scooter',
    vehiclePlate: 'DK-1234-SC',
    isAvailable: true,
    rating: 4.8,
    completedOrders: 156
  },
  {
    id: 'driver002',
    email: 'fatou.diallo@dakar.go',
    firstName: 'Fatou',
    lastName: 'Diallo',
    role: 'driver',
    phone: '781234567',
    vehicleType: 'van',
    vehiclePlate: 'DK-5678-VN',
    isAvailable: true,
    rating: 4.9,
    completedOrders: 203
  },
  {
    id: 'driver003',
    email: 'ibrahima.ndiaye@dakar.go',
    firstName: 'Ibrahima',
    lastName: 'Ndiaye',
    role: 'driver',
    phone: '761234567',
    vehicleType: 'scooter',
    vehiclePlate: 'DK-9012-SC',
    isAvailable: true,
    rating: 4.7,
    completedOrders: 124
  }
];

export default function DriverLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const driver = mockDrivers.find(d => d.email === email);
      
      if (driver && password === 'password123') {
        // Generate a mock token
        const token = `mock-token-${Date.now()}`;
        
        // Call the login function from AuthContext
        login(driver, token);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${driver.firstName}!`,
        });
      } else {
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image 
            src="/logo.png" 
            alt="Dakar GO Logo" 
            width={120} 
            height={120} 
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Dakar GO Driver
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte chauffeur
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connexion Chauffeur</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre tableau de bord
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="chauffeur@dakar.go"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              <div className="text-sm text-center mt-2">
                <p className="text-gray-500">
                  Pour les tests, utilisez:
                </p>
                <p className="text-gray-700 font-medium">
                  Email: moussa.sow@dakar.go
                </p>
                <p className="text-gray-700 font-medium">
                  Mot de passe: password123
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-4">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
            Accès Marchand
          </Link>
        </div>
      </div>
    </div>
  );
}