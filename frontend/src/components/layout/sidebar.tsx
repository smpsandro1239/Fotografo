'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Aperture, LayoutDashboard, Calendar, Images, Package, Car, CalendarCheck, ShoppingBag, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/use-api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/events', label: 'Eventos', icon: Calendar },
  { href: '/dashboard/albums', label: 'Álbuns', icon: Images },
  { href: '/dashboard/photos', label: 'Fotos', icon: Images },
  { href: '/dashboard/packs', label: 'Packs', icon: Package },
  { href: '/dashboard/vehicles', label: 'Veículos', icon: Car },
  { href: '/dashboard/reservations', label: 'Reservas', icon: CalendarCheck },
  { href: '/dashboard/orders', label: 'Encomendas', icon: ShoppingBag },
  { href: '/dashboard/notifications', label: 'Notificações', icon: Bell },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useProfile();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-gold/10 bg-surface',
        className
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-gold/10 px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Aperture className="h-6 w-6 text-gold" strokeWidth={1.5} />
          <span className="font-display text-lg font-semibold tracking-wide gold-text">LUMINA</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-muted-foreground hover:bg-gold/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-gold/10" />

      <div className="p-3">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
            pathname === '/dashboard/settings'
              ? 'bg-gold/10 text-gold'
              : 'text-muted-foreground hover:bg-gold/5 hover:text-foreground'
          )}
        >
          <Settings className="h-4 w-4" strokeWidth={1.5} />
          <span>Definições</span>
        </Link>
      </div>

      <Separator className="bg-gold/10" />

      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-gold/10 text-gold text-sm font-medium">
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : user?.email?.slice(0, 2).toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name || 'Utilizador'}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
}
