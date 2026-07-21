'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Loader2, Save, Eye, EyeOff, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const eventSchema = z.object({
  name: z.string().min(3, 'Mínimo de 3 caracteres'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  location: z.string().optional(),
  isPublic: z.boolean(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: event, isLoading } = useEvent(id);
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        isPublic: event.isPublic,
      });
    }
  }, [event, reset]);

  const onSubmit = (values: EventFormValues) => {
    updateEvent.mutate(
      { id, data: { ...values, date: new Date(values.date).toISOString() } },
      {
        onSuccess: () => {
          toast.success('Evento atualizado com sucesso.');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleTogglePublish = () => {
    if (!event) return;
    updateEvent.mutate(
      { id, data: { isPublic: !event.isPublic } },
      {
        onSuccess: () =>
          toast.success(event.isPublic ? 'Evento despublicado.' : 'Evento publicado.'),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = () => {
    deleteEvent.mutate(id, {
      onSuccess: () => {
        toast.success('Evento eliminado com sucesso.');
        router.push('/dashboard/events');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-4 w-16" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Evento não encontrado.</p>
        <Button asChild>
          <Link href="/dashboard/events">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Editar Evento</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleTogglePublish}>
              {event.isPublic ? (
                <><EyeOff className="mr-1 h-4 w-4" /> Despublicar</>
              ) : (
                <><Eye className="mr-1 h-4 w-4" /> Publicar</>
              )}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-1 h-4 w-4" /> Eliminar
            </Button>
          </div>
        </CardHeader>

        <form id="event-form" onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" {...register('description')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input id="date" type="datetime-local" {...register('date')} />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input id="location" {...register('location')} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                {...register('isPublic')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublic" className="cursor-pointer font-normal">
                Evento público
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateEvent.isPending}>
              {updateEvent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A guardar...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar evento</DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja eliminar o evento &quot;{event.name}&quot;? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteEvent.isPending}>
              {deleteEvent.isPending ? 'A eliminar...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
