"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Images,
  Camera,
  Package,
  Car,
  Ticket,
  ShoppingBag,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

// Links do dashboard (PT-PT)
const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Eventos", icon: Calendar },
  { href: "/dashboard/albums", label: "Álbuns", icon: Images },
  { href: "/dashboard/photos", label: "Fotos", icon: Camera },
  { href: "/dashboard/packs", label: "Packs", icon: Package },
  { href: "/dashboard/vehicles", label: "Veículos", icon: Car },
  { href: "/dashboard/reservations", label: "Reservas", icon: Ticket },
  { href: "/dashboard/orders", label: "Encomendas", icon: ShoppingBag },
  { href: "/dashboard/notifications", label: "Notificações", icon: Bell },
  { href: "/dashboard/settings", label: "Definições", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Navegação principal">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={pathname === href ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

// Sidebar fixa em desktop (w-64); em mobile é aberta via Sheet pelo Header
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Camera className="h-6 w-6" aria-hidden />
        <span className="text-lg font-bold">Fotografo</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>
    </aside>
  );
}

// Sheet de navegação mobile (controlado pelo store ui)
export function SidebarMobile() {
  const open = useUIStore((s) => s.sidebarOpen);
  const setOpen = useUIStore((s) => s.setSidebarOpen);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="px-6 pt-2 text-lg font-bold">Fotografo</SheetTitle>
        <div className="py-4">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
