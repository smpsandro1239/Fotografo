import axios, { AxiosError } from "axios";
import type { AuthTokens } from "./types";

// Cliente HTTP para a API do Fotografo (backend NestJS)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  withCredentials: true, // cookies httpOnly geridos pelo backend quando aplicável
});

const TOKEN_KEY = "fotografo_access_token";
const REFRESH_KEY = "fotografo_refresh_token";

// Armazenamento em memória + localStorage apenas como fallback de dev.
// Em produção o recomendado é cookie httpOnly via rota BFF; aqui mantemos
// simplicidade porque o backend devolve tokens no body (auth.service.ts).
export function setTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Interceptor: injeta Bearer token em todas as requests autenticadas
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: em 401 tenta refresh uma vez; se falhar, limpa sessão
let refreshing: Promise<boolean> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosError["config"] & { _retry?: boolean })
      | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;
      refreshing =
        refreshing ??
        (async () => {
          const refreshToken =
            typeof window !== "undefined"
              ? localStorage.getItem(REFRESH_KEY)
              : null;
          if (!refreshToken) return false;
          try {
            const { data } = await axios.post<AuthTokens>(
              `${api.defaults.baseURL}/auth/refresh`,
              {},
              {
                headers: { Authorization: `Bearer ${refreshToken}` },
              },
            );
            setTokens(data);
            return true;
          } catch {
            clearTokens();
            return false;
          } finally {
            refreshing = null;
          }
        })();
      const ok = await refreshing;
      if (ok && original.headers) {
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return api(original);
      }
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// ---- Helpers de erro tipados (PT europeu) ----
export function extractApiError(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (typeof data?.message === "string") return data.message;
    if (err.code === "ERR_NETWORK")
      return "Sem ligação ao servidor. Verifique se o backend está a correr.";
  }
  return "Ocorreu um erro inesperado. Tente novamente.";
}

// ---- Endpoints de autenticação ----
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/auth/login", payload);
  setTokens(data);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/auth/register", payload);
  setTokens(data);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    clearTokens();
  }
}
