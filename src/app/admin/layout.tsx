import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-muted/50 border-b sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-foreground">
            <Package className="w-6 h-6" />
            <span>fructiFruit Admin</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/">View Store</Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
