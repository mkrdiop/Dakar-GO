"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Driver } from '@/lib/types';
import { Bell, Lock, Globe, MapPin, Volume2, Moon, Sun, Smartphone, Battery, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import DriverLayout from '@/components/layout/DriverLayout';

export default function DriverSettings() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  
  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    messages: true,
    promotions: false,
    sound: true,
    vibration: true,
  });
  
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    language: 'fr',
    saveDataMode: false,
    locationAccess: true,
    batteryOptimization: true,
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricLogin: true,
    locationSharing: true,
  });

  // Redirect if not authenticated or not a driver
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'driver'))) {
      router.push('/driver/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Handle notification settings change
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Paramètre mis à jour",
      description: `Les notifications ${notificationSettings[setting] ? 'désactivées' : 'activées'}`,
    });
  };
  
  // Handle app settings change
  const handleAppSettingChange = (setting: keyof typeof appSettings, value: any) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: typeof value === 'boolean' ? value : value
    }));
    
    toast({
      title: "Paramètre mis à jour",
      description: "Vos préférences ont été enregistrées",
    });
  };
  
  // Handle security settings change
  const handleSecurityChange = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Paramètre de sécurité mis à jour",
      description: `${setting === 'twoFactorAuth' ? 'Authentification à deux facteurs' : 
                    setting === 'biometricLogin' ? 'Connexion biométrique' : 
                    'Partage de localisation'} ${securitySettings[setting] ? 'désactivé' : 'activé'}`,
    });
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été changé avec succès",
    });
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    
    if (confirmed) {
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });
      
      // Logout after account deletion
      setTimeout(() => {
        logout();
      }, 2000);
    }
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  const driver = user as Driver;
  
  return (
    <DriverLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
        
        <Tabs defaultValue="account" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="app">Application</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>
                  Gérez les informations de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={driver.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={driver.phone || ''}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={`${driver.firstName || ''} ${driver.lastName || ''}`}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Type de véhicule</Label>
                  <Input
                    id="vehicleType"
                    value={driver.vehicleType.toUpperCase()}
                    disabled
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/driver/profile')}
                >
                  Modifier mon profil
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                    />
                  </div>
                  
                  <Button type="submit">
                    Changer le mot de passe
                  </Button>
                </form>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">
                        Sécurisez votre compte avec une vérification en deux étapes
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={() => handleSecurityChange('twoFactorAuth')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="biometricLogin">Connexion biométrique</Label>
                      <p className="text-sm text-gray-500">
                        Utilisez votre empreinte digitale ou reconnaissance faciale pour vous connecter
                      </p>
                    </div>
                    <Switch
                      id="biometricLogin"
                      checked={securitySettings.biometricLogin}
                      onCheckedChange={() => handleSecurityChange('biometricLogin')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="locationSharing">Partage de localisation</Label>
                      <p className="text-sm text-gray-500">
                        Permettre à l'application de suivre votre position pendant les livraisons
                      </p>
                    </div>
                    <Switch
                      id="locationSharing"
                      checked={securitySettings.locationSharing}
                      onCheckedChange={() => handleSecurityChange('locationSharing')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zone de danger</CardTitle>
                <CardDescription>
                  Actions irréversibles pour votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  La suppression de votre compte est permanente et irréversible. Toutes vos données seront supprimées.
                </p>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Supprimer mon compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Configurez les notifications que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newOrders">Nouvelles commandes</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications pour les nouvelles commandes disponibles
                      </p>
                    </div>
                    <Switch
                      id="newOrders"
                      checked={notificationSettings.newOrders}
                      onCheckedChange={() => handleNotificationChange('newOrders')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderUpdates">Mises à jour des commandes</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications pour les mises à jour de vos commandes
                      </p>
                    </div>
                    <Switch
                      id="orderUpdates"
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={() => handleNotificationChange('orderUpdates')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="messages">Messages</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications pour les nouveaux messages
                      </p>
                    </div>
                    <Switch
                      id="messages"
                      checked={notificationSettings.messages}
                      onCheckedChange={() => handleNotificationChange('messages')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions">Promotions et actualités</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir des notifications sur les promotions et actualités
                      </p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={notificationSettings.promotions}
                      onCheckedChange={() => handleNotificationChange('promotions')}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound">Son</Label>
                      <p className="text-sm text-gray-500">
                        Activer le son pour les notifications
                      </p>
                    </div>
                    <Switch
                      id="sound"
                      checked={notificationSettings.sound}
                      onCheckedChange={() => handleNotificationChange('sound')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vibration">Vibration</Label>
                      <p className="text-sm text-gray-500">
                        Activer la vibration pour les notifications
                      </p>
                    </div>
                    <Switch
                      id="vibration"
                      checked={notificationSettings.vibration}
                      onCheckedChange={() => handleNotificationChange('vibration')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="app" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de l'application</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience avec l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center">
                    <Sun className="h-5 w-5 text-gray-500 mr-2" />
                    <Label htmlFor="darkMode">Mode sombre</Label>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={appSettings.darkMode}
                    onCheckedChange={(checked) => handleAppSettingChange('darkMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center">
                    <Globe className="h-5 w-5 text-gray-500 mr-2" />
                    <Label htmlFor="language">Langue</Label>
                  </div>
                  <Select
                    value={appSettings.language}
                    onValueChange={(value) => handleAppSettingChange('language', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="wo">Wolof</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center">
                    <Wifi className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <Label htmlFor="saveDataMode">Mode économie de données</Label>
                      <p className="text-sm text-gray-500">
                        Réduire l'utilisation des données mobiles
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="saveDataMode"
                    checked={appSettings.saveDataMode}
                    onCheckedChange={(checked) => handleAppSettingChange('saveDataMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <Label htmlFor="locationAccess">Accès à la localisation</Label>
                      <p className="text-sm text-gray-500">
                        Permettre l'accès à la localisation en arrière-plan
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="locationAccess"
                    checked={appSettings.locationAccess}
                    onCheckedChange={(checked) => handleAppSettingChange('locationAccess', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center">
                    <Battery className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <Label htmlFor="batteryOptimization">Optimisation de la batterie</Label>
                      <p className="text-sm text-gray-500">
                        Réduire la consommation de batterie
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="batteryOptimization"
                    checked={appSettings.batteryOptimization}
                    onCheckedChange={(checked) => handleAppSettingChange('batteryOptimization', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Version de l'application</p>
                  <p className="font-medium">Dakar GO Driver v1.0.0</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Conditions d'utilisation</p>
                  <Button variant="link" className="p-0 h-auto">
                    Consulter les conditions d'utilisation
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Politique de confidentialité</p>
                  <Button variant="link" className="p-0 h-auto">
                    Consulter la politique de confidentialité
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Licences open source</p>
                  <Button variant="link" className="p-0 h-auto">
                    Consulter les licences
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Vérifier les mises à jour
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DriverLayout>
  );
}