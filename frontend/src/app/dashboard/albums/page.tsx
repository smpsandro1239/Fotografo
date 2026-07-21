'use client';

import { useState } from 'react';
import { useEvents, useAlbums, useCreateAlbum } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Images, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AlbumsPage() {
  const { data: eventsData, isLoading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState('');
  const { data: albums, isLoading: albumsLoading } = useAlbums(selectedEventId);
  const createAlbum = useCreateAlbum();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const events = eventsData?.data ?? [];

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim() || !selectedEventId) return;
    createAlbum.mutate(
      { eventId: selectedEventId, data: { name: newAlbumName.trim() } },
      {
        onSuccess: () => {
          toast.success('Álbum criado com sucesso.');
          setShowCreateDialog(false);
          setNewAlbumName('');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (eventsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Álbuns</h1>

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-full sm:w-72">
          <Label className="mb-1 block">Seleccionar Evento</Label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um evento..." />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEventId && (
          <div className="flex items-end">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Álbum
            </Button>
          </div>
        )}
      </div>

      {!selectedEventId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Images className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Selecione um evento para ver os seus álbuns.
            </p>
          </CardContent>
        </Card>
      ) : albumsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : albums && albums.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Card key={album.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{album.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(album.createdAt).toLocaleDateString('pt-PT')}
                </span>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/albums/${album.id}`}>
                    Ver Fotos
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Images className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum álbum neste evento.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Álbum
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Álbum</DialogTitle>
            <DialogDescription>Dê um nome ao novo álbum.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nome do álbum"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAlbum}
              disabled={!newAlbumName.trim() || createAlbum.isPending}
            >
              {createAlbum.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
