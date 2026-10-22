"use client";

import toast from "react-hot-toast";
import { Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { extractApiError } from "@/lib/api";
import { useReservations, useConfirmReservation, useCancelReservation } from "@/hooks/use-api";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

// Lista de reservas com confirmação/cancelamento
export default function ReservationsPage() {
  const { data: reservations, isLoading } = useReservations();
  const confirm = useConfirmReservation();
  const cancel = useCancelReservation();

  async function handleConfirm(id: string) {
    try {
      await confirm.mutateAsync(id);
      toast.success("Reserva confirmada");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancel.mutateAsync(id);
      toast.success("Reserva cancelada");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Reservas</h2>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations?.length ? (
              reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{new Date(r.date).toLocaleDateString("pt-PT")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "CONFIRMED"
                          ? "default"
                          : r.status === "CANCELLED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {STATUS_LABEL[r.status] ?? r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "PENDING" && (
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleConfirm(r.id)}>
                          <Check className="mr-1 h-4 w-4" /> Confirmar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCancel(r.id)}>
                          <XIcon className="mr-1 h-4 w-4" /> Cancelar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Sem reservas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
