"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  api,
  clearTokens,
  getAccessToken,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  type LoginPayload,
  type RegisterPayload,
} from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provedor de autenticação: guarda o utilizador em memória e revalida
// a sessão no arranque via GET /users/me (JWT strategy do backend).
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function restore() {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get<User>("/users/me");
        if (active) setUser(data);
      } catch {
        clearTokens();
      } finally {
        if (active) setLoading(false);
      }
    }
    void restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      await apiLogin(payload);
      const { data } = await api.get<User>("/users/me");
      setUser(data);
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await apiRegister(payload);
      const { data } = await api.get<User>("/users/me");
      setUser(data);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
