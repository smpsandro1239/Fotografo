"use client";

import Link from "next/link";
import { Calendar, Ticket, Euro, BellRing, Plus, Upload } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents, useReservations, useNotifications } from "@/hooks/use-api";

// Página inicial do dashboard: stats + eventos recentes + ações rápidas
export default function DashboardPage() {
  const { data: events, isLoading: loadingEvents } = useEvents();
  const { data: reservations } = useReservations();
  const { data: notifications } = useNotifications();

  const pendentes = reservations?.filter((r) => r.status === "PENDING").length ?? 0;
  const naoLidas = notifications?.filter((n) => !n.read).length ?? 0;
  const recentes = [...(events ?? [])]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total de Eventos" value={events?.length ?? 0} icon={Calendar} />
        <StatsCard title="Reservas Pendentes" value={pendentes} icon={Ticket} />
        <StatsCard title="Notificações Não Lidas" value={naoLidas} icon={BellRing} />
        <StatsCard title="Receita Estimada" value="—" icon={Euro} description="Disponível após pagamentos" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/dashboard/events"><Plus className="mr-2 h-4 w-4" /> Criar Evento</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/reservations"><Ticket className="mr-2 h-4 w-4" /> Ver Reservas</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/photos"><Upload className="mr-2 h-4 w-4" /> Carregar Fotos</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingEvents ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : recentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ainda não existem eventos.</p>
          ) : (
            recentes.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Link href={`/dashboard/events/${ev.id}`} className="font-medium hover:underline">
                    {ev.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ev.date).toLocaleDateString("pt-PT")} — {ev.location ?? "Sem local"}
                  </p>
                </div>
                <Badge variant={ev.isPublic ? "default" : "secondary"}>
                  {ev.isPublic ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
