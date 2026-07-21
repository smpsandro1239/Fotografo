import { create } from 'zustand';

interface FiltersState {
  eventFilter: string | null;
  albumFilter: string | null;
  reservationStatus: string | null;
  orderStatus: string | null;
  setEventFilter: (id: string | null) => void;
  setAlbumFilter: (id: string | null) => void;
  setReservationStatus: (status: string | null) => void;
  setOrderStatus: (status: string | null) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  eventFilter: null,
  albumFilter: null,
  reservationStatus: null,
  orderStatus: null,
  setEventFilter: (id) => set({ eventFilter: id }),
  setAlbumFilter: (id) => set({ albumFilter: id }),
  setReservationStatus: (status) => set({ reservationStatus: status }),
  setOrderStatus: (status) => set({ orderStatus: status }),
  resetFilters: () =>
    set({ eventFilter: null, albumFilter: null, reservationStatus: null, orderStatus: null }),
}));
