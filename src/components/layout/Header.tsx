
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, UserCircle, PackagePlus, LayoutDashboard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage && !isAuthenticated) { // Don't show header on login/signup if not logged in. Can be adjusted.
     return null; // Or a simpler header for auth pages
  }


  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={isAuthenticated ? "/dashboard" : "/login"} className="text-2xl font-bold text-primary">
          Dakar Go
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Bienvenue, {user?.email || 'Marchand'}
              </span>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} title="Tableau de bord">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Tableau de bord
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push('/create-order')} title="Créer une commande">
                 <PackagePlus className="mr-2 h-4 w-4" /> Nouvelle Commande
              </Button>
              <Button variant="outline" size="sm" onClick={logout} title="Se déconnecter">
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
              </Button>
            </>
          ) : (
            <>
              {pathname !== '/login' && (
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  Se connecter
                </Button>
              )}
              {pathname !== '/signup' && (
                <Button size="sm" onClick={() => router.push('/signup')}>
                  S'inscrire
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
