"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";
import { useAlbums, useEvents, useCreateAlbum } from "@/hooks/use-api";

export default function AlbumsPage() {
  const { data: albums, isLoading } = useAlbums();
  const { data: events } = useEvents();
  const createAlbum = useCreateAlbum();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [eventId, setEventId] = useState("");

  async function onSubmit() {
    if (!name || !eventId) {
      toast.error("Preencha o nome e o evento.");
      return;
    }
    try {
      await createAlbum.mutateAsync({ name, eventId });
      toast.success("Álbum criado com sucesso");
      setOpen(false);
      setName("");
      setEventId("");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Álbuns</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Criar Álbum
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums?.map((al) => (
            <Link key={al.id} href={`/dashboard/albums/${al.id}`}>
              <Card className="hover:bg-muted">
                <CardHeader>
                  <CardTitle>{al.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {new Date(al.createdAt).toLocaleDateString("pt-PT")}
                </CardContent>
              </Card>
            </Link>
          ))}
          {!albums?.length && (
            <p className="text-sm text-muted-foreground">Sem álbuns criados.</p>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Álbum</DialogTitle>
            <DialogDescription>Associado a um evento existente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="album-name">Nome</Label>
              <Input id="album-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album-event">Evento</Label>
              <select
                id="album-event"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">Selecione…</option>
                {events?.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
            <Button onClick={onSubmit} disabled={createAlbum.isPending} className="w-full">
              {createAlbum.isPending ? "A criar…" : "Criar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
