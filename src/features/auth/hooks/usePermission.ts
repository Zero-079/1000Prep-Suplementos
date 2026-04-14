// src/features/auth/hooks/usePermission.ts
/**
 * Hook para verificar permisos del usuario
 */

'use client'

import { useMemo } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { hasPermission, hasRole, type Action, type Role } from '@/config/permissions'
import type { UsePermissionOptions, UsePermissionResult } from '../types/auth'

/**
 * Hook para verificar si el usuario tiene un permiso específico
 * 
 * @param action - La acción a verificar
 * @param options - Opciones adicionales
 * 
 * @example
 * // Verificar si puede editar suplementos
 * const canEdit = usePermission('edit:supplement')
 * 
 * @example
 * // Verificar si puede crear pedidos (permite usuarios no autenticados)
 * const canCreate = usePermission('create:order', { allowUnauthenticated: true })
 */
export function usePermission(
  action: Action,
  options: UsePermissionOptions = {}
): UsePermissionResult {
  const { allowUnauthenticated = false } = options
  const { user, isLoading: isAuthLoading } = useAuthContext()

  const result = useMemo<UsePermissionResult>(() => {
    // Si está cargando, retornar estado de loading
    if (isAuthLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        isAuthenticated: false,
        userRole: undefined,
      }
    }

    // Si no hay usuario
    if (!user) {
      return {
        hasPermission: allowUnauthenticated,
        isLoading: false,
        isAuthenticated: false,
        userRole: undefined,
      }
    }

    // Verificar permiso
    const hasAccess = hasPermission(user.role, action)

    return {
      hasPermission: hasAccess,
      isLoading: false,
      isAuthenticated: true,
      userRole: user.role,
    }
  }, [user, isAuthLoading, action, allowUnauthenticated])

  return result
}

/**
 * Hook para verificar si el usuario tiene uno de los roles permitidos
 * 
 * @param allowedRoles - Roles que tienen acceso
 * 
 * @example
 * // Solo admins y sellers pueden acceder
 * const canAccess = useRoles(['ADMIN', 'SELLER'])
 */
export function useRoles(allowedRoles: Role[]): UsePermissionResult {
  const { user, isLoading: isAuthLoading } = useAuthContext()

  const result = useMemo<UsePermissionResult>(() => {
    if (isAuthLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        isAuthenticated: false,
        userRole: undefined,
      }
    }

    if (!user) {
      return {
        hasPermission: false,
        isLoading: false,
        isAuthenticated: false,
        userRole: undefined,
      }
    }

    const hasAccess = hasRole(user.role, allowedRoles)

    return {
      hasPermission: hasAccess,
      isLoading: false,
      isAuthenticated: true,
      userRole: user.role,
    }
  }, [user, isAuthLoading, allowedRoles])

  return result
}

/**
 * Hook para obtener los permisos del usuario actual
 * 
 * @example
 * const { permissions, isSeller, isAdmin } = useUserPermissions()
 */
export function useUserPermissions() {
  const { user, isLoading: isAuthLoading } = useAuthContext()

  return useMemo(() => {
    if (isAuthLoading || !user) {
      return {
        permissions: [] as Action[],
        isClient: false,
        isSeller: false,
        isAdmin: false,
        isLoading: true,
      }
    }

    const { hasPermission } = require('@/config/permissions')
    
    return {
      permissions: [
        hasPermission(user.role, 'view:account') && 'view:account',
        hasPermission(user.role, 'view:orders') && 'view:orders',
        hasPermission(user.role, 'create:order') && 'create:order',
        hasPermission(user.role, 'edit:supplement') && 'edit:supplement',
        hasPermission(user.role, 'create:supplement') && 'create:supplement',
        hasPermission(user.role, 'delete:supplement') && 'delete:supplement',
      ].filter(Boolean) as Action[],
      isClient: user.role === 'CLIENT',
      isSeller: user.role === 'SELLER',
      isAdmin: user.role === 'ADMIN',
      isLoading: false,
    }
  }, [user, isAuthLoading])
}

// Export por defecto
export default usePermission