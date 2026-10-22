"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvent, useAlbums } from "@/hooks/use-api";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: event, isLoading } = useEvent(id);
  const { data: albums } = useAlbums(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!event) return <p className="text-muted-foreground">Evento não encontrado.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Voltar">
          <Link href="/dashboard/events"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h2 className="text-xl font-semibold">{event.name}</h2>
        <Badge variant={event.isPublic ? "default" : "secondary"}>
          {event.isPublic ? "Publicado" : "Rascunho"}
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">Data:</span> {new Date(event.date).toLocaleString("pt-PT")}</p>
          <p><span className="font-medium">Localização:</span> {event.location ?? "—"}</p>
          <p><span className="font-medium">Descrição:</span> {event.description ?? "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Álbuns ({albums?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {albums?.length ? (
            albums.map((al) => (
              <Link key={al.id} href={`/dashboard/albums/${al.id}`} className="block rounded-lg border p-3 hover:bg-muted">
                {al.name}
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sem álbuns associados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
