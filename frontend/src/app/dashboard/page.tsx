'use client';

import { usePhotographerStats, useEvents } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Camera, ShoppingCart, Euro, Plus, Images, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = usePhotographerStats('month');
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: 5 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summary = (stats as any)?.summary;

  if (statsLoading || eventsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-surface-light" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="gold-border bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 bg-surface-lighter" />
                <Skeleton className="h-4 w-4 bg-surface-lighter" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-20 mb-1 bg-surface-lighter" />
                <Skeleton className="h-3 w-28 bg-surface-lighter" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full bg-surface-light" />
        <Skeleton className="h-32 w-full bg-surface-light" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gold-border bg-card/50 hover:bg-card transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-gold" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{summary?.totalEvents ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="gold-border bg-card/50 hover:bg-card transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Fotos
            </CardTitle>
            <Camera className="h-4 w-4 text-gold" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{summary?.totalPhotos ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="gold-border bg-card/50 hover:bg-card transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Reservas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gold" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{summary?.totalReservations ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="gold-border bg-card/50 hover:bg-card transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <Euro className="h-4 w-4 text-gold" strokeWidth={1.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              {formatPrice(summary?.totalRevenue ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="gold-border bg-card/50">
        <CardHeader>
          <CardTitle className="font-display text-lg">Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsData?.data && eventsData.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gold/10 hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventsData.data.map((event) => (
                  <TableRow key={event.id} className="border-gold/10">
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(event.date)}</TableCell>
                    <TableCell className="text-muted-foreground">{event.location || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={event.isPublic ? 'default' : 'secondary'}
                        className={event.isPublic ? 'bg-gold/15 text-gold border-gold/20' : ''}
                      >
                        {event.isPublic ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum evento encontrado.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gold-border bg-card/50">
        <CardHeader>
          <CardTitle className="font-display text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="gold-gradient text-background font-medium hover:opacity-90 transition-opacity">
            <Link href="/dashboard/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Criar Evento
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gold/20 hover:bg-gold/5 hover:border-gold/40 transition-all">
            <Link href="/dashboard/albums">
              <Images className="mr-2 h-4 w-4" />
              Ver Galeria
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gold/20 hover:bg-gold/5 hover:border-gold/40 transition-all">
            <Link href="/dashboard/events">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Ver Reservas
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
