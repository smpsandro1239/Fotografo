"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { extractApiError } from "@/lib/api";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-api";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  PROCESSING: "Em processamento",
  COMPLETED: "Concluída",
  SHIPPED: "Enviada",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelada",
};

// Encomendas de impressões com mudança de estado via select
export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleChange(orderId: string, status: string) {
    setPendingId(orderId);
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success("Estado atualizado");
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Encomendas</h2>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Alterar Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length ? (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}</TableCell>
                  <TableCell>{(o.total / 100).toFixed(2)} €</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString("pt-PT")}</TableCell>
                  <TableCell>
                    <Badge variant={o.status === "COMPLETED" ? "default" : o.status === "CANCELLED" ? "destructive" : "secondary"}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={o.status}
                      onValueChange={(v) => handleChange(o.id, v)}
                      disabled={pendingId === o.id}
                    >
                      <SelectTrigger className="ml-auto w-44" aria-label={`Estado da encomenda ${o.id.slice(0, 8)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Sem encomendas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
