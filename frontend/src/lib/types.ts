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
  events?: Event[];
  packs?: Pack[];
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
}

export interface Album {
  id: string;
  eventId: string;
  event?: Event;
  name: string;
  createdAt: string;
  updatedAt: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  albumId: string;
  album?: Album;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  stats?: Stat[];
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
  options?: Record<string, string>;
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
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: Record<string, string>;
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