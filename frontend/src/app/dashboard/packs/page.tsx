'use client';

import { useState } from 'react';
import { usePacks } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PacksPage() {
  const { data: packs, isLoading } = usePacks();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingPackId(null);
    setForm({ name: '', price: '', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (pack: any) => {
    setEditingPackId(pack.id);
    setForm({ name: pack.name, price: String(pack.price / 100), description: pack.description || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error('Nome e preco sao obrigatorios.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name, price: Math.round(parseFloat(form.price) * 100), description: form.description || undefined };
      if (editingPackId) {
        await api.patch(`/packs/${editingPackId}`, payload);
        toast.success('Pack atualizado com sucesso.');
      } else {
        await api.post('/packs', payload);
        toast.success('Pack criado com sucesso.');
      }
      queryClient.invalidateQueries({ queryKey: ['packs'] });
      setDialogOpen(false);
    } catch {
      toast.error('Erro ao guardar pack.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/packs/${deleteId}`);
      queryClient.invalidateQueries({ queryKey: ['packs'] });
      toast.success('Pack eliminado com sucesso.');
      setDeleteId(null);
    } catch {
      toast.error('Erro ao eliminar pack.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packs</h1>
          <p className="text-muted-foreground">Gerencie seus pacotes fotograficos</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pack
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {packs && packs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preco</TableHead>
                  <TableHead>Descricao</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs.map((pack) => (
                  <TableRow key={pack.id}>
                    <TableCell className="font-medium">{pack.name}</TableCell>
                    <TableCell>{formatPrice(pack.price)}</TableCell>
                    <TableCell className="max-w-xs truncate">{pack.description || '\u2014'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(pack)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(pack.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">Nenhum pack encontrado.</p>
              <Button onClick={openNew}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Pack
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPackId ? 'Editar Pack' : 'Novo Pack'}</DialogTitle>
            <DialogDescription>Preencha os dados do pack.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Preco (EUR)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
            <Input
              placeholder="Descricao (opcional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar pack</DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja eliminar este pack? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
