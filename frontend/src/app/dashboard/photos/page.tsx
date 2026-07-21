'use client';

import { useState } from 'react';
import { useEvents, useAlbums, usePhotos } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Image, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function PhotosPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: eventsData, isLoading: eventsLoading } = useEvents();
  const events = eventsData?.data ?? [];

  const { data: albums, isLoading: albumsLoading } = useAlbums(selectedEventId);
  const { data: photos, isLoading: photosLoading } = usePhotos(selectedAlbumId);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/photos/${deleteId}`);
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast.success('Foto eliminada com sucesso.');
      setDeleteId(null);
    } catch {
      toast.error('Erro ao eliminar foto.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fotos</h1>
        <p className="text-muted-foreground">Galeria de fotos por evento e álbum</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedEventId}
          onValueChange={(v) => {
            setSelectedEventId(v);
            setSelectedAlbumId('');
          }}
          disabled={eventsLoading}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Selecionar evento..." />
          </SelectTrigger>
          <SelectContent>
            {events.map((ev) => (
              <SelectItem key={ev.id} value={ev.id}>
                {ev.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedAlbumId}
          onValueChange={setSelectedAlbumId}
          disabled={!selectedEventId || albumsLoading}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Selecionar álbum..." />
          </SelectTrigger>
          <SelectContent>
            {albums?.map((al) => (
              <SelectItem key={al.id} value={al.id}>
                {al.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(!selectedEventId || !selectedAlbumId) && (
        <Card>
          <CardContent className="text-center py-12">
            <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Selecione um evento e um álbum para ver as fotos
            </p>
          </CardContent>
        </Card>
      )}

      {selectedEventId && selectedAlbumId && photosLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      )}

      {selectedEventId && selectedAlbumId && !photosLoading && photos && photos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhuma foto neste álbum</p>
          </CardContent>
        </Card>
      )}

      {selectedEventId && selectedAlbumId && !photosLoading && photos && photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <img
                src={photo.thumbnail || photo.url}
                alt=""
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => setLightboxPhoto(photo.url)}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(photo.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!lightboxPhoto} onOpenChange={() => setLightboxPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <button
            className="absolute right-4 top-4 z-50 text-white opacity-70 hover:opacity-100"
            onClick={() => setLightboxPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxPhoto || ''}
            alt=""
            className="w-full max-h-[85vh] object-contain"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar foto</DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja eliminar esta foto? Esta ação não pode ser desfeita.
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
