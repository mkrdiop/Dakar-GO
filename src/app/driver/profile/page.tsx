"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Driver } from '@/lib/types';
import { User, Phone, Mail, MapPin, Star, Package, Truck, Calendar, Edit } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import DriverLayout from '@/components/layout/DriverLayout';

export default function DriverProfile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    vehiclePlate: '',
  });

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'driver'))) {
      router.push('/driver/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const driver = user as Driver;
      setFormData({
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        email: driver.email,
        phone: driver.phone || '',
        address: '', // Not in the current user model
        vehiclePlate: driver.vehiclePlate || '',
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to update the user profile
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès",
    });
    
    setIsEditing(false);
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  const driver = user as Driver;
  
  return (
    <DriverLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={`${driver.firstName} ${driver.lastName}`} />
                  <AvatarFallback className="text-2xl">
                    {driver.firstName?.[0]}{driver.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{driver.firstName} {driver.lastName}</CardTitle>
                <CardDescription>Chauffeur {driver.vehicleType.toUpperCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium">{driver.rating} / 5</span>
                    <span className="text-sm text-gray-500 ml-2">(32 avis)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{driver.completedOrders} livraisons complétées</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Membre depuis Janvier 2023</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier mon profil
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Taux d'acceptation</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">98%</p>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Livraisons à temps</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">95%</p>
                      <Badge className="bg-green-100 text-green-800">Très bon</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Satisfaction client</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">4.8/5</p>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Modifier mon profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vehiclePlate">Plaque d'immatriculation</Label>
                      <Input
                        id="vehiclePlate"
                        name="vehiclePlate"
                        value={formData.vehiclePlate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      Enregistrer les modifications
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">{driver.firstName} {driver.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{driver.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{driver.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">Dakar, Sénégal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Informations du véhicule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Type de véhicule</p>
                        <p className="font-medium">{driver.vehicleType.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-3">
                        <span className="text-xs font-bold">№</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Plaque d'immatriculation</p>
                        <p className="font-medium">{driver.vehiclePlate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Année du véhicule</p>
                        <p className="font-medium">2022</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Avis récents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>AF</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Aminata Fall</p>
                            <p className="text-sm text-gray-500">Il y a 2 jours</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">
                        Livraison rapide et chauffeur très professionnel. Je recommande vivement !
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>MD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Moussa Diop</p>
                            <p className="text-sm text-gray-500">Il y a 1 semaine</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">
                        Bonne livraison, colis en parfait état. Un peu de retard mais le chauffeur m'a prévenu.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Voir tous les avis
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}