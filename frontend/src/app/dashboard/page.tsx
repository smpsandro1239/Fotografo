import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'next/link';
import { Camera, Calendar, Package, ShoppingBag, BarChart3, Bell, User, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getPhotographerStats('month');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard/events', label: 'Eventos', icon: Calendar, count: stats?.summary?.totalEvents },
    { href: '/dashboard/photos', label: 'Fotos', icon: Camera, count: stats?.summary?.totalPhotos },
    { href: '/dashboard/packs', label: 'Packs', icon: Package },
    { href: '/dashboard/orders', label: 'Encomendas', icon: ShoppingBag, count: stats?.summary?.totalReservations },
    { href: '/dashboard/stats', label: 'Estatísticas', icon: BarChart3 },
    { href: '/dashboard/notifications', label: 'Notificações', icon: Bell },
    { href: '/dashboard/settings', label: 'Definições', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
              <Camera className="h-8 w-8" />
              <span>Fotografo</span>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-card border-b border-border">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Camera className="h-7 w-7" />
            <span>Fotografo</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Bem-vindo, {user?.name || 'Fotógrafo'}</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/events/new">
                <Camera className="h-4 w-4 mr-2" />
                Novo Evento
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Eventos Totais</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.summary?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.summary?.conversionRate}% conversão
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Fotos</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.summary?.totalPhotos || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.summary?.totalViews} visualizações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Favoritos</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.summary?.totalFavorites || 0}</div>
                <p className="text-xs text-muted-foreground">Interações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Receita</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.summary?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.summary?.totalReservations} reservas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Criar Evento</h3>
                    <p className="text-sm text-muted-foreground">Novo casamento, batizado, etc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Criar Pack</h3>
                    <p className="text-sm text-muted-foreground">Pacotes de fotografia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-purple/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ver Estatísticas</h3>
                    <p className="text-sm text-muted-foreground">Relatórios detalhados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentEvents?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentEvents.slice(0, 5).map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('pt-PT')} • {event._count?.photos || 0} fotos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          event.isPublic ? 'bg-green/10 text-green' : 'bg-yellow/10 text-yellow'
                        )}>
                          {event.isPublic ? 'Público' : 'Privado'}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/events/${event.id}`}>Ver</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium mb-2">Nenhum evento criado</h3>
                  <p className="text-muted-foreground mb-4">Comece por criar o seu primeiro evento</p>
                  <Button asChild>
                    <Link href="/dashboard/events/new">Criar Evento</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}