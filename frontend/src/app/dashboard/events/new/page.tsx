"use client";

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Camera, Calendar, MapPin, Shield, ArrowLeft, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

export default function NewEventPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      date: '',
      location: '',
      isPublic: true,
    },
  });

  const onSubmit = async (data: { name: string; description: string; date: string; location: string; isPublic: boolean }) => {
    setIsLoading(true);
    try {
      await api.post('/events', {
        name: data.name,
        description: data.description,
        date: new Date(data.date).toISOString(),
        location: data.location,
        isPublic: data.isPublic,
      });
      toast.success('Evento criado com sucesso!');
      router.push('/dashboard/events');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar evento');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-2xl">
        <div className="mb-8">
          <Link href="/dashboard/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-primary" />
              <CardTitle>Novo Evento</CardTitle>
            </div>
            <CardDescription>Crie um novo evento de fotografia</CardDescription>
          </CardHeader>

          <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Evento *</Label>
              <Input
                id="name"
                placeholder="Ex: Casamento João e Maria"
                {...register('name', {
                  required: 'Nome é obrigatório',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Detalhes sobre o evento..."
                {...register('description')}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data do Evento *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...register('date', { required: 'Data é obrigatória' })}
                  className={errors.date ? 'border-destructive' : ''}
                />
                {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo, SP"
                  {...register('location')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibilidade</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  {...register('isPublic', { value: true })}
                  checked={true}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPublic" className="cursor-pointer font-normal">
                  Público (visível para clientes)
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Eventos públicos aparecem na galeria pública e podem receber reservas.
              </p>
            </div>
          </form>

          <CardFooter className="flex justify-between">
            <Link href="/dashboard/events">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} form="event-form">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Evento
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}