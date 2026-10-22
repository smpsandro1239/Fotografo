"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, MoreHorizontal, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractApiError } from "@/lib/api";
import {
  useEvents, useCreateEvent, usePublishEvent, useUnpublishEvent, useDeleteEvent,
} from "@/hooks/use-api";

const eventSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  date: z.string().min(1, "A data é obrigatória"),
  location: z.string().optional(),
  description: z.string().optional(),
});
type EventForm = z.infer<typeof eventSchema>;

// Tabela de eventos com criação via dialog + publicar/despublicar/eliminar
export default function EventsPage() {
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const publish = usePublishEvent();
  const unpublish = useUnpublishEvent();
  const remove = useDeleteEvent();
  const [open, setOpen] = useState(false);

  const form = useForm<EventForm>({ resolver: zodResolver(eventSchema) });

  async function onSubmit(values: EventForm) {
    try {
      await createEvent.mutateAsync({
        ...values,
        date: new Date(values.date).toISOString(),
      });
      toast.success("Evento criado com sucesso");
      setOpen(false);
      form.reset();
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handlePublish(id: string, isPublic: boolean) {
    try {
      await (isPublic ? unpublish : publish).mutateAsync(id);
      toast.success(isPublic ? "Evento despublicado" : "Evento publicado");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove.mutateAsync(id);
      toast.success("Evento eliminado");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Eventos</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Criar Evento
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.length ? (
              events.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell>
                    <Link className="font-medium hover:underline" href={`/dashboard/events/${ev.id}`}>
                      {ev.name}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(ev.date).toLocaleDateString("pt-PT")}</TableCell>
                  <TableCell>{ev.location ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={ev.isPublic ? "default" : "secondary"}>
                      {ev.isPublic ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Ações do evento ${ev.name}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handlePublish(ev.id, ev.isPublic)}>
                          {ev.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {ev.isPublic ? "Despublicar" : "Publicar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDelete(ev.id)}>
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Sem eventos. Crie o primeiro evento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Evento</DialogTitle>
            <DialogDescription>Preencha os dados do novo evento.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...form.register("name")} placeholder="Casamento na Quinta da Casa Branca" />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...form.register("date")} />
              {form.formState.errors.date && (
                <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" {...form.register("location")} placeholder="Lisboa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" {...form.register("description")} />
            </div>
            <Button type="submit" disabled={createEvent.isPending} className="w-full">
              {createEvent.isPending ? "A criar…" : "Criar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
