"use client";

import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/api";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/use-api";

// Centro de notificações com marcação individual e total como lidas
export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  async function handleMarkAll() {
    try {
      await markAllRead.mutateAsync();
      toast.success("Todas as notificações foram lidas");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notificações</h2>
        <Button variant="outline" onClick={handleMarkAll} disabled={markAllRead.isPending}>
          <CheckCheck className="mr-2 h-4 w-4" /> Marcar todas como lidas
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Atividade recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications?.length ? (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && markRead.mutate(n.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted ${
                    n.read ? "opacity-70" : "bg-muted/50"
                  }`}
                >
                  <p className="font-medium">{n.title ?? "Notificação"}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("pt-PT")}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sem notificações.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
