// Tipos partilhados do frontend (espelham o schema Prisma do backend)

export type UserRole = "ADMIN" | "PHOTOGRAPHER" | "CLIENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string | null;
  date: string;
  location?: string | null;
  isPublic: boolean;
  photographerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  name: string;
  description?: string | null;
  eventId: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  albumId: string;
  key: string;
  url?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
}

export interface Pack {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  photographerId: string;
}

export interface Vehicle {
  id: string;
  name: string;
  available: boolean;
  packId?: string | null;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  status: ReservationStatus;
  date: string;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "SHIPPED";

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "RESERVATION_CONFIRMED"
  | "RESERVATION_CANCELLED"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED"
  | "ORDER_CREATED"
  | "ORDER_COMPLETED"
  | "ORDER_SHIPPED"
  | "NEW_MESSAGE";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  data?: Record<string, unknown> | null;
  createdAt: string;
}
