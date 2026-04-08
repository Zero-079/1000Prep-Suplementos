// src/features/auth/hooks/useAuth.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { authService, type LoginPayload, type RegisterPayload } from '../services/auth.service';

export function useAuth() {
  const router = useRouter();
  const {
    setIsAuthenticated,
    setUser,
    isAuthenticated,
    user,
    isLoading: isAuthLoading,
  } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setIsAuthenticated(true);
      setUser(response.user);
      const destination = response.user.role === 'SELLER' ? '/catalogo' : '/';
      router.push(destination);
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
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
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

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
