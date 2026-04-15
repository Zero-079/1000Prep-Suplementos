// src/features/auth/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import useSWR from 'swr';
import { axiosFetcher } from '@/lib/use-swr';
import type { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider con SWR
 * - Deduplica requests automáticamente con otros componentes
 * - Cachea la sesión en memoria
 * - Usa estado local para permitir transición de loading a no-loading
 * - Revalida automáticamente SOLO cuando hay sesión activa
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  // Usar useMemo para evitar que el objeto de opciones se recree en cada render
  // Esto es necesario porque SWR compara las opciones por referencia
  const swrOptions = useMemo(() => ({
    revalidateOnFocus: hasSession,
    revalidateOnReconnect: hasSession,
    revalidateIfStale: hasSession,
    dedupingInterval: 5000,
    fallbackData: undefined,
    onSuccess: () => {
      setHasSession(true)
      setHasCheckedSession(true)
    },
    onError: () => {
      setHasSession(false)
      setHasCheckedSession(true)
    },
  }), [hasSession])

  // KEY dinámico que fuerza remount cuando cambia hasSession
  // Esto hace que SWR reevalúe las opciones con los nuevos valores
  const swrKey = useMemo(() => ['/auth/me', hasSession] as const, [hasSession])

  const { data, isLoading: swrLoading, mutate } = useSWR<{ user: User }>(
    swrKey,
    ([key]) => axiosFetcher(key),
    swrOptions
  )

  const user = data?.user ?? null
  const isAuthenticated = !!user

  // IMPORTANTE: Usar swrLoading en lugar de !hasCheckedSession para evitar flash
  // El problema era: cuando hasCheckedSession = true, isLoading = false pero user todavía no estaba actualizado
  // Con swrLoading, el skeleton se muestra hasta que SWR tenga datos reales (success o error)
  const isLoading = swrLoading

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