// src/features/auth/types/auth.ts
/**
 * Tipos de autenticación y autorización
 */

import type { Role, Action } from '@/config/permissions'

// ============================================================================
// Usuario
// ============================================================================

/**
 * Usuario del sistema con información de autenticación y rol
 */
export interface User {
  id: string
  email: string
  name: string
  role: Role
  avatarUrl?: string
}

/**
 * Datos del usuario devueltos por la API
 */
export interface UserResponse {
  user: User
}

// ============================================================================
// Autenticación
// ============================================================================

/**
 * Payload para login
 */
export interface LoginPayload {
  email: string
  password: string
}

/**
 * Payload para registro
 */
export interface RegisterPayload {
  email: string
  password: string
  name: string
  address?: {
    street: string
    number: string
    city: string
    province: string
    postalCode: string
  }
}

/**
 * Respuesta de login
 */
export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

/**
 * Respuesta de registro
 */
export interface RegisterResponse {
  message: string
}

// ============================================================================
// Contexto de autenticación
// ============================================================================

/**
 * Estado del contexto de autenticación
 */
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * Métodos del contexto de autenticación
 */
export interface AuthContextType extends AuthState {
  setUser: (user: User | null) => void
  setIsAuthenticated: (value: boolean) => void
  mutate: () => Promise<{ user: User } | undefined>
}

// ============================================================================
// Permisos
// ============================================================================

/**
 * Opciones para el hook usePermission
 */
export interface UsePermissionOptions {
  /**
   * Si es true, devuelve true cuando el usuario no está autenticado
   * Útil para mensajes de "inicia sesión para hacer X"
   * @default false
   */
  allowUnauthenticated?: boolean
}

/**
 * Resultado del hook usePermission
 */
export interface UsePermissionResult {
  /**
   * true si el usuario tiene el permiso
   */
  hasPermission: boolean
  /**
   * true si está cargando la información de auth
   */
  isLoading: boolean
  /**
   * true si el usuario está autenticado
   */
  isAuthenticated: boolean
  /**
   * el rol del usuario
   */
  userRole: Role | undefined
}

// ============================================================================
// Tipos utilitarios
// ============================================================================

/**
 * Array de roles permitidos
 */
export type AllowedRoles = Role[]

/**
 * Array de acciones permitidas
 */
export type AllowedActions = Action[]