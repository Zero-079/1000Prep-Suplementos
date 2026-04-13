// src/features/auth/hooks/useAuth.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { authService, setRefreshToken, setAccessToken, type LoginPayload, type RegisterPayload } from '../services/auth.service';

export function useAuth() {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    isLoading: isAuthLoading,
    mutate,
  } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      console.log('[useAuth] Login response:', response);
      // Guardar refresh_token en store para que el interceptor pueda usarlo
      if (response.refresh_token) {
        console.log('[useAuth] Setting refresh token:', response.refresh_token.substring(0, 20) + '...');
        setRefreshToken(response.refresh_token);
      } else {
        console.log('[useAuth] No refresh_token in response!');
      }
      // Revalidar auth para actualizar el contexto
      await mutate();
      const destination = response.user.role === 'SELLER' ? '/catalogo' : '/';
      router.push(destination);
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, mutate]);

  const register = useCallback(async (data: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      router.push('/login');
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    // Limpiar tokens PRIMERO antes de cualquier cosa
    setAccessToken(null);
    setRefreshToken(null);
    
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err: any) {
      // Ignorar errores - tokens ya limpiados
    }
    
    // RECARGAR la página para limpiar todo el estado (SWR cache, React state, etc)
    // Esto evita el dropdown stale
    window.location.href = '/login';
  }, []);

  return {
    login,
    register,
    logout,
    isLoading,
    isAuthLoading,
    error,
    isAuthenticated,
    user,
  };
}