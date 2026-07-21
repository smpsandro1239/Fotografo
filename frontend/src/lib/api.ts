import type { User, Event, Album, Photo, Pack, Reservation, Order, Notification, PaginatedResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = localStorage.getItem('accessToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw new Error(error.message || 'Request failed');
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth
  async login(email: string, password: string) {
    return this.post<{ access_token: string; refresh_token: string }>('/auth/login', { email, password });
  }

  async register(email: string, password: string, name?: string) {
    return this.post<{ access_token: string; refresh_token: string }>('/auth/register', { email, password, name });
  }

  async refreshToken(refreshToken: string) {
    return this.post<{ access_token: string; refresh_token: string }>('/auth/refresh', { refreshToken });
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getProfile() {
    return this.get<User>('/users/profile');
  }

  async updateProfile(data: Partial<User>) {
    return this.patch<User>('/users/profile', data);
  }

  // Events
  async getEvents(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    return this.get<PaginatedResponse<Event>>(`/events${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
  }

  async getEvent(id: string) {
    return this.get<Event>(`/events/${id}`);
  }

  async createEvent(data: Partial<Event>) {
    return this.post<Event>('/events', data);
  }

  async updateEvent(id: string, data: Partial<Event>) {
    return this.patch<Event>(`/events/${id}`, data);
  }

  async deleteEvent(id: string) {
    return this.delete(`/events/${id}`);
  }

  async publishEvent(id: string) {
    return this.post<Event>(`/events/${id}/publish`);
  }

  // Albums
  async getAlbums(eventId: string) {
    return this.get<Album[]>(`/events/${eventId}/albums`);
  }

  async createAlbum(eventId: string, data: Partial<Album>) {
    return this.post<Album>(`/events/${eventId}/albums`, data);
  }

  // Photos
  async getPhotos(albumId: string) {
    return this.get<Photo[]>(`/albums/${albumId}/photos`);
  }

  async uploadPhoto(albumId: string, file: File, metadata?: Record<string, string>) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${this.baseUrl}/albums/${albumId}/photos`, {
      method: 'POST',
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Packs
  async getPacks() {
    return this.get<Pack[]>('/packs');
  }

  async createPack(data: Partial<Pack>) {
    return this.post<Pack>('/packs', data);
  }

  // Reservations
  async getReservations() {
    return this.get<Reservation[]>('/reservations');
  }

  async createReservation(eventId: string) {
    return this.post<Reservation>('/reservations', { eventId });
  }

  async updateReservationStatus(id: string, status: string) {
    return this.patch<Reservation>(`/reservations/${id}/status`, { status });
  }

  async cancelReservation(id: string) {
    return this.delete<Reservation>(`/reservations/${id}`);
  }

  // Payments
  async createReservationPaymentIntent(reservationId: string, amount: number) {
    return this.post<{ clientSecret: string; paymentIntentId: string }>(
      `/payments/reservation/${reservationId}/intent`,
      { amount }
    );
  }

  // Orders
  async getOrders() {
    return this.get<Order[]>('/orders');
  }

  async createOrder(data: { packId: string; eventId?: string; quantity?: number; options?: Record<string, string> }) {
    return this.post<Order>('/orders', data);
  }

  async createOrderPaymentIntent(orderId: string) {
    return this.post<{ clientSecret: string; paymentIntentId: string }>(`/orders/${orderId}/payment-intent`);
  }

  // Stats
  async getPhotographerStats(period: string = 'month') {
    return this.get(`/stats/photographer?period=${period}`);
  }

  async getEventStats(eventId: string) {
    return this.get(`/stats/event/${eventId}`);
  }

  async getClientStats() {
    return this.get('/stats/client');
  }

  // Notifications
  async getNotifications(unreadOnly = false, page = 1, limit = 20) {
    return this.get<PaginatedResponse<Notification>>(`/notifications?unreadOnly=${unreadOnly}&page=${page}&limit=${limit}`);
  }

  async getUnreadCount() {
    return this.get<{ count: number }>('/notifications/unread-count');
  }

  async markAsRead(id: string) {
    return this.patch(`/notifications/${id}/read`);
  }

  async markAllAsRead() {
    return this.patch('/notifications/read-all');
  }
}

export const api = new ApiClient(API_URL);