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
import { usePacks, useCreatePack, useDeletePack } from "@/hooks/use-api";

// Gestão de packs de fotografias (preços em cêntimos, exibidos em euros)
export default function PacksPage() {
  const { data: packs, isLoading } = usePacks();
  const createPack = useCreatePack();
  const removePack = useDeletePack();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  async function onSubmit() {
    if (!form.name || !form.price) {
      toast.error("Nome e preço são obrigatórios.");
      return;
    }
    try {
      await createPack.mutateAsync({
        name: form.name,
        description: form.description,
        price: Math.round(parseFloat(form.price) * 100),
      });
      toast.success("Pack criado com sucesso");
      setOpen(false);
      setForm({ name: "", description: "", price: "" });
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Packs</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Criar Pack
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
              <TableHead>Preço</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packs?.length ? (
              packs.map((pk) => (
                <TableRow key={pk.id}>
                  <TableCell className="font-medium">{pk.name}</TableCell>
                  <TableCell className="text-muted-foreground">{pk.description ?? "—"}</TableCell>
                  <TableCell>{(pk.price / 100).toFixed(2)} €</TableCell>
                  <TableCell>
                    <Badge variant={pk.active ? "default" : "secondary"}>
                      {pk.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar pack ${pk.name}`}
                      onClick={async () => {
                        try {
                          await removePack.mutateAsync(pk.id);
                          toast.success("Pack eliminado");
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
                  Sem packs criados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Pack</DialogTitle>
            <DialogDescription>Defina o nome, descrição e preço do pack.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pack-name">Nome</Label>
              <Input id="pack-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pack-desc">Descrição</Label>
              <Input id="pack-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pack-price">Preço (€)</Label>
              <Input id="pack-price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <Button onClick={onSubmit} disabled={createPack.isPending} className="w-full">
              {createPack.isPending ? "A criar…" : "Criar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
