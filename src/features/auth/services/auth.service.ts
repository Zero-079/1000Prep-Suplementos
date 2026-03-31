// src/config/api.ts
import { fetchAPI, API_BASE_URL } from '@/config/api';

export interface AddressPayload {
  label: string;
  street: string;
  neighborhood: string;
  city: string;
  references?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  address: AddressPayload;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expiresIn: string;
}

// URL del backend para OAuth (necesita directa porque es redirect)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    return fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    });
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    return fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    });
  },

  async logout(): Promise<void> {
    return fetchAPI('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },

  // Iniciar flujo OAuth con Google — redirige al backend
  loginWithGoogle() {
    window.location.href = `${BACKEND_URL}/auth/google`;
  },
};
