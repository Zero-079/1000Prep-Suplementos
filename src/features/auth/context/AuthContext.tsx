// src/features/auth/context/AuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import useSWR from 'swr';
import { axiosFetcher } from '@/lib/use-swr';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  mutate: () => Promise<{ user: User } | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider con SWR
 * - Deduplica requests automáticamente con otros componentes
 * - Cachea la sesión en memoria
 * - Usa estado local para permitir transición de loading a no-loading
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  
  const { data, isLoading: swrLoading, mutate } = useSWR<{ user: User }>(
    '/auth/me',
    (key) => axiosFetcher(key),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      fallbackData: undefined,
      // onSuccess se ejecuta cuando hay usuario autenticado
      onSuccess: () => setHasCheckedSession(true),
      // onError se ejecuta cuando hay error (401, 500, etc) - también significa "checked"
      onError: () => setHasCheckedSession(true),
    }
  )

  const user = data?.user ?? null
  const isAuthenticated = !!user
  
  // Solo mostrar loading si no hemos verificado la sesión todavía
  const isLoading = !hasCheckedSession

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        setUser: () => {},
        setIsAuthenticated: () => {},
        mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
}