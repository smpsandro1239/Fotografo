"use client";

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, Search, Shield, Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Search, Shield, Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location?: string;
  isPublic: boolean;
  createdAt: string;
  _count: {
    albums: number;
    reservations: number;
  };
}

export default function EventsPage() {
  const { isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'public' && event.isPublic) ||
      (statusFilter === 'private' && !event.isPublic);
    return matchesSearch && matchesStatus;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">Gerencie seus eventos de fotografia</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'public' | 'private')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar visibilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="public">Públicos</SelectItem>
              <SelectItem value="private">Privados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          {events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Evento</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Local</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Visibilidade</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Álbuns</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Reservas</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Criado</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4">
                        <p className="font-medium">{event.name}</p>
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                        )}
                      </td>
                      <td className="p-4">
                        {format(new Date(event.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="p-4">
                        {event.location || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          event.isPublic
                            ? 'bg-green/10 text-green'
                            : 'bg-yellow/10 text-yellow'
                        )}>
                          {event.isPublic ? 'Público' : 'Privado'}
                        </span>
                      </td>
                      <td className="p-4">{event._count.albums}</td>
                      <td className="p-4">{event._count.reservations}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(new Date(event.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/events/${event.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/events/${event.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-2">Nenhum evento</h3>
              <p className="text-muted-foreground mb-4">
                {search || statusFilter !== 'all'
                  ? 'Nenhum evento encontrado com esses filtros'
                  : 'Comece criando o seu primeiro evento'}
              </p>
              <Button asChild>
                <Link href="/dashboard/events/new">Criar Evento</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}