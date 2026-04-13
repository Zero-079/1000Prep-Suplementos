// src/features/auth/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
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
  
  // Usar una referencia para controlar revalidación basada en si hay sesión activa
  // Se inicializa como false y se actualiza cuando hay datos
  const shouldRevalidate = React.useRef(false)
  
  const { data, isLoading: swrLoading, mutate } = useSWR<{ user: User }>(
    '/auth/me',
    (key) => axiosFetcher(key),
    {
      // Revalidar automáticamente solo cuando hay datos válidos en cache
      revalidateOnFocus: shouldRevalidate.current,
      revalidateOnReconnect: shouldRevalidate.current,
      dedupingInterval: 5000,
      fallbackData: undefined,
      onSuccess: () => {
        shouldRevalidate.current = true
        setHasCheckedSession(true)
      },
      onError: () => {
        shouldRevalidate.current = false
        setHasCheckedSession(true)
      },
    }
  )

  // Actualizar la referencia cuando hay datos
  if (data?.user) {
    shouldRevalidate.current = true
  }
  
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