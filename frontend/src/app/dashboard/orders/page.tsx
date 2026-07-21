'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/use-api';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, MoreHorizontal, Eye } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  PROCESSING: 'outline',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
  SHIPPED: 'outline',
};

const statusLabel: Record<string, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Em processamento',
  COMPLETED: 'Concluida',
  CANCELLED: 'Cancelada',
  SHIPPED: 'Enviada',
};

const allStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'SHIPPED'];

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const filtered = orders?.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Estado atualizado.');
    } catch {
      toast.error('Erro ao atualizar estado.');
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
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
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
        <h1 className="text-3xl font-bold tracking-tight">Encomendas</h1>
        <p className="text-muted-foreground">Gerencie as encomendas dos clientes</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
          <TabsTrigger value="PROCESSING">Em processamento</TabsTrigger>
          <TabsTrigger value="COMPLETED">Concluidas</TabsTrigger>
          <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <Card>
            <CardContent className="p-0">
              {filtered && filtered.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.user?.name || order.user?.email || '\u2014'}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[order.status] || 'secondary'}>
                            {statusLabel[order.status] || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/orders/${order.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalhe
                                </Link>
                              </DropdownMenuItem>
                              {allStatuses
                                .filter((s) => s !== order.status)
                                .map((s) => (
                                  <DropdownMenuItem key={s} onClick={() => handleChangeStatus(order.id, s)}>
                                    Mudar para {statusLabel[s]}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhuma encomenda encontrada.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
