import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, LogOut, User as UserIcon } from 'lucide-react';
import { AdminNav } from './nav-links';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/auth/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userInitial = user.email ? user.email[0].toUpperCase() : '?';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-muted/50 border-b sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-foreground">
            <Package className="w-6 h-6" />
            <span>fructiFruit Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">View Store</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={signOut} className="w-full">
                    <DropdownMenuItem asChild>
                        <button type="submit" className="w-full text-left flex items-center cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-8">
        <AdminNav />
        {children}
      </main>
    </div>
  );
}
