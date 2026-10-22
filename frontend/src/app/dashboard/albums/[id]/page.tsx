"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlbum, usePhotos } from "@/hooks/use-api";

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: album, isLoading } = useAlbum(id);
  const { data: photos } = usePhotos(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!album) return <p className="text-muted-foreground">Álbum não encontrado.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Voltar">
          <Link href="/dashboard/albums"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h2 className="flex-1 text-xl font-semibold">{album.name}</h2>
        <Button asChild>
          <Link href="/dashboard/photos"><Upload className="mr-2 h-4 w-4" /> Carregar Fotos</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos?.map((p) => (
          <div key={p.id} className="aspect-square overflow-hidden rounded-lg border bg-muted">
            {p.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.url} alt={album.name} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
        ))}
        {!photos?.length && (
          <p className="col-span-full text-sm text-muted-foreground">
            Este álbum ainda não tem fotos.
          </p>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{photos?.length ?? 0} fotografias</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          As imagens são servidas via Cloudflare R2 com URLs assinadas.
        </CardContent>
      </Card>
    </div>
  );
}
