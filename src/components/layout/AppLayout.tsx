
"use client";
import type { ReactNode } from 'react';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';


export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Chargement de l'application...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
     // This case should ideally be handled by the useEffect redirect,
     // but as a fallback, show loading or redirect.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg">Redirection vers la page de connexion...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-card text-center py-4 border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Dakar Go. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
