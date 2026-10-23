"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";
import { useVehicles, useCreateVehicle, useDeleteVehicle } from "@/hooks/use-api";

// Gestão da frota de veículos (schema do backend: packId, name, description, available)
export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const removeVehicle = useDeleteVehicle();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", packId: "", description: "" });

  async function onSubmit() {
    if (!form.name || !form.packId) {
      toast.error("Nome e pack são obrigatórios.");
      return;
    }
    try {
      await createVehicle.mutateAsync({
        name: form.name,
        packId: form.packId,
        description: form.description || undefined,
        available: true,
      });
      toast.success("Veículo criado com sucesso");
      setOpen(false);
      setForm({ name: "", packId: "", description: "" });
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Veículos</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Veículo
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Pack</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles?.length ? (
              vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>{v.description ?? "—"}</TableCell>
                  <TableCell>{v.packId}</TableCell>
                  <TableCell>
                    <Badge variant={v.available ? "default" : "secondary"}>
                      {v.available ? "Disponível" : "Indisponível"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar veículo ${v.name}`}
                      onClick={async () => {
                        try {
                          await removeVehicle.mutateAsync(v.id);
                          toast.success("Veículo eliminado");
                        } catch (err) {
                          toast.error(extractApiError(err));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Sem veículos registados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Veículo</DialogTitle>
            <DialogDescription>Registe um novo veículo da frota.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-name">Nome</Label>
              <Input id="vehicle-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-pack">ID do Pack</Label>
              <Input id="vehicle-pack" value={form.packId} onChange={(e) => setForm({ ...form, packId: e.target.value })} placeholder="UUID do pack associado" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-description">Descrição</Label>
              <Input id="vehicle-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ideal para sessões de recém-nascidos…" />
            </div>
            <Button onClick={onSubmit} disabled={createVehicle.isPending} className="w-full">
              {createVehicle.isPending ? "A criar…" : "Criar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
