'use client';

import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePhotos } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params.id as string;
  const queryClient = useQueryClient();
  const { data: photos, isLoading } = usePhotos(albumId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPreviews = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;
    setUploading(true);
    try {
      await Promise.all(
        previews.map((p) => api.uploadPhoto(albumId, p.file))
      );
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      queryClient.invalidateQueries({ queryKey: ['photos', albumId] });
      toast.success(`${previews.length} foto(s) carregada(s) com sucesso.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar fotos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/photos/${deleteId}`);
      queryClient.invalidateQueries({ queryKey: ['photos', albumId] });
      toast.success('Foto eliminada.');
      setDeleteId(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao eliminar foto.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/albums"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Álbum</h1>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Fotos
          </Button>
          {previews.length > 0 && (
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'A carregar...' : `Carregar ${previews.length} foto(s)`}
            </Button>
          )}
        </div>
      </div>

      {previews.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Pré-visualização ({previews.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={preview.url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(i)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos && photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square">
              <img
                src={photo.thumbnail || photo.url}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => setDeleteId(photo.id)}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : previews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum álbum encontrado neste álbum.
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Carregar Fotos
            </Button>
          </CardContent>
        </Card>
      ) : null}

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
            <Button variant="destructive" onClick={handleDeletePhoto}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
