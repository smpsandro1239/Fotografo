export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'PHOTOGRAPHER' | 'CLIENT';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Photographer {
  id: string;
  userId: string;
  user: User;
  bio?: string;
  website?: string;
  portfolio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  photographerId: string;
  photographer?: Photographer;
  name: string;
  description?: string;
  date: string;
  location?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  albums?: Album[];
  reservations?: Reservation[];
  _count?: { albums: number; reservations: number; photos: number };
}

export interface Album {
  id: string;
  eventId: string;
  event?: Event;
  name: string;
  createdAt: string;
  updatedAt: string;
  photos?: Photo[];
  _count?: { photos: number };
}

export interface Photo {
  id: string;
  albumId: string;
  album?: Album;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  stats?: Stat[];
  _count?: { stats: number };
}

export interface Stat {
  id: string;
  photoId: string;
  photo?: Photo;
  type: 'VIEW' | 'FAVORITE' | 'DOWNLOAD' | 'SHARE';
  createdAt: string;
}

export interface Pack {
  id: string;
  photographerId: string;
  photographer?: Photographer;
  name: string;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  vehicles?: Vehicle[];
}

export interface Vehicle {
  id: string;
  packId: string;
  pack?: Pack;
  name: string;
  description?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  user?: User;
  eventId: string;
  event?: Event;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'SHIPPED';
  total: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  order?: Order;
  type: 'PHOTO' | 'ALBUM' | 'PACK' | 'PRINT' | 'DIGITAL_DOWNLOAD';
  referenceId: string;
  quantity: number;
  unitPrice: number;
  options?: Record<string, any>;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId?: string;
  order?: Order;
  reservationId?: string;
  reservation?: Reservation;
  stripeId: string;
  amount: number;
  status: 'SUCCEEDED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELLED' | 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED' | 'ORDER_CREATED' | 'ORDER_COMPLETED' | 'ORDER_SHIPPED' | 'NEW_MESSAGE' | 'SYSTEM_MAINTENANCE' | 'GALLERY_PUBLISHED' | 'PHOTOS_SELECTED';
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}