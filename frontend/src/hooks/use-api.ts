'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Auth
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name?: string }) =>
      api.register(email, password, name),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

// Events
export function useEvents(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => api.getEvents(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => api.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.createEvent>[0]) => api.createEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updateEvent>[1] }) =>
      api.updateEvent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

// Albums
export function useAlbums(eventId: string) {
  return useQuery({
    queryKey: ['albums', eventId],
    queryFn: () => api.getAlbums(eventId),
    enabled: !!eventId,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Parameters<typeof api.createAlbum>[1] }) =>
      api.createAlbum(eventId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['albums'] }),
  });
}

// Photos
export function usePhotos(albumId: string) {
  return useQuery({
    queryKey: ['photos', albumId],
    queryFn: () => api.getPhotos(albumId),
    enabled: !!albumId,
  });
}

// Packs
export function usePacks() {
  return useQuery({
    queryKey: ['packs'],
    queryFn: () => api.getPacks(),
  });
}

// Reservations
export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: () => api.getReservations(),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => api.createReservation(eventId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations'] }),
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.getOrders(),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.createOrder>[0]) => api.createOrder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}

// Stats
export function usePhotographerStats(period: string = 'month') {
  return useQuery({
    queryKey: ['stats', 'photographer', period],
    queryFn: () => api.getPhotographerStats(period),
  });
}

export function useEventStats(eventId: string) {
  return useQuery({
    queryKey: ['stats', 'event', eventId],
    queryFn: () => api.getEventStats(eventId),
    enabled: !!eventId,
  });
}

// Notifications
export function useNotifications(unreadOnly = false, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['notifications', unreadOnly, page, limit],
    queryFn: () => api.getNotifications(unreadOnly, page, limit),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.getUnreadCount(),
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}
