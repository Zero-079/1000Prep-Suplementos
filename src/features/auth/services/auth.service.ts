// src/features/auth/services/auth.service.ts
import axiosInstance from '@/lib/axios'
import type { AxiosResponse } from 'axios'

export interface AddressPayload {
  label: string
  street: string
  neighborhood: string
  city: string
  references?: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  address: AddressPayload
  password: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  }
  access_token?: string;  // Token en JSON (opcional)
  refresh_token?: string;  // Token en JSON para que JS pueda leerlo
  expiresIn: string
  refresh_expires_in?: string;
}

/**
 * Store en memoria para tokens
 * Necesario porque cookies httpOnly no son accesibles desde JS
 */
const tokenStore = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
};

export function getAccessToken(): string | null {
  return tokenStore.accessToken;
}

export function setAccessToken(token: string | null): void {
  tokenStore.accessToken = token;
}

export function getRefreshToken(): string | null {
  return tokenStore.refreshToken;
}

export function setRefreshToken(token: string | null): void {
  tokenStore.refreshToken = token;
}

// URL del backend para OAuth (necesita directa porque es redirect)

// URL del backend para OAuth (necesita directa porque es redirect)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/register', data)
    return response.data
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', data)
    return response.data
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/refresh/logout')
  },

  // Iniciar flujo OAuth con Google — redirige al backend
  loginWithGoogle() {
    window.location.href = `${BACKEND_URL}/auth/google`
  },
}