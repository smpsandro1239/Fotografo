import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

const TOKEN_KEY = 'fotografo_tokens';
const USER_KEY = 'fotografo_user';

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user: User) => set({ user }),

      checkAuth: async () => {
        const storedTokens = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedTokens) {
          const tokens = JSON.parse(storedTokens);
          set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
        }

        if (storedUser) {
          const user = JSON.parse(storedUser);
          set({ user });
        }

        if (get().accessToken) {
          try {
            const user = await api.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            // Token might be expired, try refresh
            try {
              await get().refreshAccessToken();
              const user = await api.getProfile();
              set({ user, isAuthenticated: true, isLoading: false });
            } catch {
              get().logout();
            }
          }
        } else {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const { access_token, refresh_token } = await api.login(email, password);

        const tokens = { accessToken: access_token, refreshToken: refresh_token };
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

        set({ accessToken: access_token, refreshToken: refresh_token });

        const user = await api.getProfile();
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true });
      },

      register: async (email: string, password: string, name?: string) => {
        const { access_token, refresh_token } = await api.register(email, password, name);

        const tokens = { accessToken: access_token, refreshToken: refresh_token };
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

        set({ accessToken: access_token, refreshToken: refresh_token });

        const user = await api.getProfile();
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token');

        const { access_token, refresh_token } = await api.refreshToken(refreshToken);

        const tokens = { accessToken: access_token, refreshToken: refresh_token };
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

        set({ accessToken: access_token, refreshToken: refresh_token });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth on app load
if (typeof window !== 'undefined') {
  useAuth.getState().checkAuth();
}