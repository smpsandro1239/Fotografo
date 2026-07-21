'use client';

import { useState } from 'react';
import { useReservations } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  CANCELLED: 'destructive',
};

const statusLabel: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
};

export default function ReservationsPage() {
  const { data: reservations, isLoading } = useReservations();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState<string | null>(null);

  const filtered = reservations?.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleConfirm = async (id: string) => {
    try {
      await api.updateReservationStatus(id, 'CONFIRMED');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva confirmada.');
    } catch {
      toast.error('Erro ao confirmar reserva.');
    }
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await api.cancelReservation(cancelId);
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva cancelada.');
      setCancelId(null);
    } catch {
      toast.error('Erro ao cancelar reserva.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-80" />
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground">Gerencie as reservas dos clientes</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmadas</TabsTrigger>
          <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <Card>
            <CardContent className="p-0">
              {filtered && filtered.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.event?.name || '\u2014'}</TableCell>
                        <TableCell>{r.user?.name || r.user?.email || '\u2014'}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[r.status] || 'secondary'}>
                            {statusLabel[r.status] || r.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(r.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {r.status === 'PENDING' && (
                              <Button variant="ghost" size="icon" onClick={() => handleConfirm(r.id)}>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {r.status !== 'CANCELLED' && (
                              <Button variant="ghost" size="icon" onClick={() => setCancelId(r.id)}>
                                <XCircle className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/reservations/${r.id}`}>Detalhe</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar reserva</DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja cancelar esta reserva? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelId(null)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancelar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
