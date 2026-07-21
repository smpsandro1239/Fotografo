'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Reservation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CheckCircle, CreditCard, ShoppingCart } from 'lucide-react';
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

export default function ReservationDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { data: reservation, isLoading } = useQuery({
    queryKey: ['reservations', id],
    queryFn: () => api.get<Reservation>(`/reservations/${id}`),
    enabled: !!id,
  });

  const confirmMutation = useMutation({
    mutationFn: () => api.updateReservationStatus(id, 'CONFIRMED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reserva confirmada.');
    },
    onError: () => toast.error('Erro ao confirmar.'),
  });

  const handlePaymentIntent = async () => {
    setPaymentLoading(true);
    try {
      const result = await api.createReservationPaymentIntent(id, 0);
      setClientSecret(result.clientSecret);
      toast.success('Payment Intent criado. Client Secret: ' + result.clientSecret.slice(0, 20) + '...');
    } catch {
      toast.error('Erro ao criar payment intent.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Reserva nao encontrada.</p>
        <Button asChild>
          <Link href="/dashboard/reservations">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/reservations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reserva</h1>
          <p className="text-muted-foreground">{reservation.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Evento</p>
              <p className="font-medium">{reservation.event?.name || '\u2014'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data do Evento</p>
              <p className="font-medium">{reservation.event?.date ? formatDate(reservation.event.date) : '\u2014'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Localizacao</p>
              <p className="font-medium">{reservation.event?.location || '\u2014'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{reservation.user?.name || reservation.user?.email || '\u2014'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={statusVariant[reservation.status]}>
                {statusLabel[reservation.status]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criada em</p>
              <p className="font-medium">{formatDate(reservation.createdAt)}</p>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {reservation.status === 'PENDING' && (
                <>
                  <Button onClick={() => confirmMutation.mutate()} disabled={confirmMutation.isPending}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {confirmMutation.isPending ? 'A confirmar...' : 'Confirmar'}
                  </Button>
                  <Button variant="outline" onClick={handlePaymentIntent} disabled={paymentLoading}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {paymentLoading ? 'A processar...' : 'Pago via Stripe'}
                  </Button>
                </>
              )}
              {reservation.status === 'CONFIRMED' && (
                <Button asChild>
                  <Link href={`/dashboard/orders/new?reservationId=${reservation.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Criar Encomenda
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {clientSecret && (
        <Card>
          <CardHeader>
            <CardTitle>Stripe Payment Intent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Client Secret:</p>
            <code className="block p-3 bg-muted rounded text-xs break-all">{clientSecret}</code>
            <p className="text-xs text-muted-foreground mt-2">
              A integracao completa com Stripe Elements pode ser feita depois.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
