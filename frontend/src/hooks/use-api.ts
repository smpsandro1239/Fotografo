"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Album,
  AppNotification,
  Event,
  Order,
  Pack,
  Photo,
  Reservation,
  Vehicle,
} from "@/lib/types";

// ---- Hooks TanStack Query do dashboard (Ronda 8 recuperada) ----
// Padrão: queryKey estável + invalidateQueries nas mutações.

// Eventos (7)
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => api.get<Event[]>("/events").then((r) => r.data),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => api.get<Event>(`/events/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => api.post("/events", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Event> & { id: string }) =>
      api.patch(`/events/${id}`, data),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", v.id] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function usePublishEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/events/${id}/publish`),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useUnpublishEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/events/${id}/unpublish`),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

// Álbuns (5)
export function useAlbums(eventId?: string) {
  return useQuery({
    queryKey: ["albums", eventId ?? "all"],
    queryFn: () =>
      api
        .get<Album[]>("/albums", { params: eventId ? { eventId } : {} })
        .then((r) => r.data),
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: ["albums", id],
    queryFn: () => api.get<Album>(`/albums/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Album>) => api.post("/albums", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["albums"] }),
  });
}

export function useUpdateAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Album> & { id: string }) =>
      api.patch(`/albums/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["albums"] }),
  });
}

export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/albums/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["albums"] }),
  });
}

// Fotos (4)
export function usePhotos(albumId?: string) {
  return useQuery({
    queryKey: ["photos", albumId ?? "all"],
    queryFn: () =>
      api
        .get<Photo[]>("/photos", { params: albumId ? { albumId } : {} })
        .then((r) => r.data),
  });
}

export function usePhoto(id: string) {
  return useQuery({
    queryKey: ["photos", id],
    queryFn: () => api.get<Photo>(`/photos/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useUploadPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: FormData) =>
      api.post("/photos/upload", form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/photos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}

// Packs (4)
export function usePacks() {
  return useQuery({
    queryKey: ["packs"],
    queryFn: () => api.get<Pack[]>("/packs").then((r) => r.data),
  });
}

export function useCreatePack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Pack>) => api.post("/packs", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packs"] }),
  });
}

export function useUpdatePack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Pack> & { id: string }) =>
      api.patch(`/packs/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packs"] }),
  });
}

export function useDeletePack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/packs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packs"] }),
  });
}

// Veículos (4)
export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => api.get<Vehicle[]>("/vehicles").then((r) => r.data),
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => api.post("/vehicles", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Vehicle> & { id: string }) =>
      api.patch(`/vehicles/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

// Reservas (3)
export function useReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: () =>
      api.get<Reservation[]>("/reservations").then((r) => r.data),
  });
}

export function useConfirmReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/reservations/${id}`, { status: "CONFIRMED" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/reservations/${id}`, { status: "CANCELLED" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });
}

// Encomendas (2)
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("/orders").then((r) => r.data),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/orders/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// Notificações (3)
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<AppNotification[]>("/notifications").then((r) => r.data),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch("/notifications/read-all"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// Estatísticas (1)
export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/stats").then((r) => r.data),
  });
}
