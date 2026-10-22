import { create } from "zustand";

// Filtros globais do dashboard (persistem entre páginas via Zustand)
export type EventFilter = "all" | "published" | "draft";
export type ReservationFilter = "all" | "pending" | "confirmed" | "cancelled";
export type OrderFilter =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "shipped";

interface FiltersStore {
  eventFilter: EventFilter;
  albumFilter: string | null;
  reservationFilter: ReservationFilter;
  orderFilter: OrderFilter;
  setEventFilter: (f: EventFilter) => void;
  setAlbumFilter: (id: string | null) => void;
  setReservationFilter: (f: ReservationFilter) => void;
  setOrderFilter: (f: OrderFilter) => void;
  reset: () => void;
}

const initial = {
  eventFilter: "all" as EventFilter,
  albumFilter: null as string | null,
  reservationFilter: "all" as ReservationFilter,
  orderFilter: "all" as OrderFilter,
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  ...initial,
  setEventFilter: (eventFilter) => set({ eventFilter }),
  setAlbumFilter: (albumFilter) => set({ albumFilter }),
  setReservationFilter: (reservationFilter) => set({ reservationFilter }),
  setOrderFilter: (orderFilter) => set({ orderFilter }),
  reset: () => set({ ...initial }),
}));
