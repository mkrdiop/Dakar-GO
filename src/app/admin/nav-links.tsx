'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
    { href: '/admin', label: 'Fruits' },
    { href: '/admin/orders', label: 'Orders' },
];

export function AdminNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin' || pathname === '/admin/new';
        }
        return pathname.startsWith(href);
    }

    return (
        <nav className="border-b mb-6">
            <div className="flex gap-6">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'py-3 text-lg text-muted-foreground hover:text-foreground transition-colors font-medium',
                            isActive(link.href) ? 'text-primary border-b-2 border-primary' : 'border-b-2 border-transparent'
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
