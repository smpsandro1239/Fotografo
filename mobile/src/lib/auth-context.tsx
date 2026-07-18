import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, User } from './api';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'fotografo_tokens';
const USER_KEY = 'fotografo_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const saveTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  const clearTokens = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const saveUser = async (userData: User) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const checkAuth = async () => {
    try {
      const storedTokens = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
      }

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }

      if (accessToken) {
        try {
          const userData = await api.getProfile();
          await saveUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be expired, try refresh
          try {
            await refreshAccessToken();
            const userData = await api.getProfile();
            await saveUser(userData);
            setIsAuthenticated(true);
          } catch {
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) throw new Error('No refresh token');

    const { access_token, refresh_token } = await api.refreshToken(refreshToken);
    const tokens = { accessToken: access_token, refreshToken: refresh_token };
    await saveTokens(tokens);
  };

  const login = async (email: string, password: string) => {
    const { access_token, refresh_token } = await api.login(email, password);
    const tokens = { accessToken: access_token, refreshToken: refresh_token };
    await saveTokens(tokens);

    const userData = await api.getProfile();
    await saveUser(userData);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, name?: string) => {
    const { access_token, refresh_token } = await api.register(email, password, name);
    const tokens = { accessToken: access_token, refreshToken: refresh_token };
    await saveTokens(tokens);

    const userData = await api.getProfile();
    await saveUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors
    }
    await clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const setUserData = (userData: User) => {
    saveUser(userData);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshAccessToken,
        setUser: setUserData,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}