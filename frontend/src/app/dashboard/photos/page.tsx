"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePhotos } from "@/hooks/use-api";

// Galeria premium: grid responsivo 2-4 colunas + modal fullscreen
export default function PhotosPage() {
  const { data: photos, isLoading } = usePhotos();
  const [selected, setSelected] = useState<string | null>(null);
  const current = photos?.find((p) => p.id === selected);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Galeria de Fotos</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos?.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className="aspect-square overflow-hidden rounded-lg border bg-muted transition-transform hover:scale-[1.02]"
            aria-label={`Ver fotografia ${p.id}`}
          >
            {p.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </button>
        ))}
        {!photos?.length && (
          <p className="col-span-full text-sm text-muted-foreground">
            Ainda não há fotos carregadas.
          </p>
        )}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da fotografia"
          onClick={() => setSelected(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white"
            aria-label="Fechar"
            onClick={() => setSelected(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.url} alt="" className="max-h-[90vh] max-w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
