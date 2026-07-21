'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get<Vehicle[]>('/vehicles'),
  });
}

export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useVehicles();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', isAvailable: true });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.name || !form.type) {
      toast.error('Nome e tipo sao obrigatorios.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/vehicles', { name: form.name, type: form.type, available: form.isAvailable });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Veiculo criado com sucesso.');
      setDialogOpen(false);
      setForm({ name: '', type: '', isAvailable: true });
    } catch {
      toast.error('Erro ao criar veiculo.');
    } finally {
      setSaving(false);
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
                <Skeleton className="h-4 w-20" />
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
          <h1 className="text-3xl font-bold tracking-tight">Veiculos</h1>
          <p className="text-muted-foreground">Gerencie seus veiculos disponiveis</p>
        </div>
        <Button onClick={() => { setForm({ name: '', type: '', isAvailable: true }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veiculo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {vehicles && vehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Disponivel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.description || '\u2014'}</TableCell>
                    <TableCell>
                      <Badge variant={v.available ? 'default' : 'secondary'}>
                        {v.available ? 'Sim' : 'Nao'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">Nenhum veiculo encontrado.</p>
              <Button onClick={() => { setForm({ name: '', type: '', isAvailable: true }); setDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Veiculo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Veiculo</DialogTitle>
            <DialogDescription>Preencha os dados do veiculo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              placeholder="Tipo (ex: sedan, SUV, van)"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                className="rounded border-input"
              />
              Disponivel
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? 'A criar...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
