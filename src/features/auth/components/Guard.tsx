// src/features/auth/components/Guard.tsx
/**
 * Componente Guard - Control de acceso granular para elementos de UI
 */

'use client'

import { ReactNode } from 'react'
import { usePermission, useRoles } from '../hooks/usePermission'
import type { Action, Role } from '@/config/permissions'
import { Loader2 } from 'lucide-react'

// ============================================================================
// Props
// ============================================================================

interface GuardBaseProps {
  /**
   * children se renderiza solo si el usuario tiene el permiso/rol
   */
  children: ReactNode
  /**
   * Fallback se renderiza si el usuario NO tiene acceso
   * Si no se proporciona, no renderiza nada (null)
   */
  fallback?: ReactNode
  /**
   * Si es true, muestra un spinner mientras carga
   * @default false
   */
  loading?: boolean
}

interface GuardActionProps extends GuardBaseProps {
  /**
   * La acción a verificar
   */
  action: Action
  roles?: never
}

interface GuardRolesProps extends GuardBaseProps {
  /**
   * Los roles que tienen acceso
   */
  roles: Role[]
  action?: never
}

type GuardProps = GuardActionProps | GuardRolesProps

// ============================================================================
// Componente
// ============================================================================

/**
 * Guard - Componente para proteger elementos de UI según permisos o roles
 * 
 * @example
 * // Por acción
 * <Guard action="edit:supplement">
 *   <Button>Editar</Button>
 * </Guard>
 * 
 * @example
 * // Por roles
 * <Guard roles={['ADMIN', 'SELLER']}>
 *   <Button>Panel Admin</Button>
 * </Guard>
 * 
 * @example
 * // Con fallback
 * <Guard action="delete:supplement" fallback={<p>No tienes permiso</p>}>
 *   <Button>Eliminar</Button>
 * </Guard>
 * 
 * @example
 * // Con loading spinner
 * <Guard action="create:order" loading>
 *   <Button>Crear Orden</Button>
 * </Guard>
 */
export function Guard(props: GuardProps) {
  const { children, fallback, loading = false } = props
  
  // Determinar tipo de verificación
  const isAction = 'action' in props && props.action !== undefined
  const isRoles = 'roles' in props && props.roles !== undefined

  // Usar el hook apropiado
  const actionResult = isAction ? usePermission(props.action!) : null
  const rolesResult = isRoles ? useRoles(props.roles!) : null

  // Preferir resultado de roles si está disponible
  const result = rolesResult ?? actionResult

  // Si está cargando y loading es true, mostrar spinner
  if (result?.isLoading && loading) {
    return (
      <span className="inline-flex items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </span>
    )
  }

  // Si no tiene permiso, renderizar fallback o null
  if (!result?.hasPermission) {
    return fallback ?? null
  }

  // Renderizar children
  return <>{children}</>
}

// ============================================================================
// Variantes especializadas
// ============================================================================

/**
 * Guard para acciones de vendedor
 */
export function SellerGuard({ children, fallback }: Omit<GuardBaseProps, 'loading' | 'action' | 'roles'>) {
  return (
    <Guard roles={['SELLER', 'ADMIN']} fallback={fallback}>
      {children}
    </Guard>
  )
}

/**
 * Guard para acciones de administrador
 */
export function AdminGuard({ children, fallback }: Omit<GuardBaseProps, 'loading' | 'action' | 'roles'>) {
  return (
    <Guard roles={['ADMIN']} fallback={fallback}>
      {children}
    </Guard>
  )
}

/**
 * Guard para clientes
 */
export function ClientGuard({ children, fallback }: Omit<GuardBaseProps, 'loading' | 'action' | 'roles'>) {
  return (
    <Guard roles={['CLIENT']} fallback={fallback}>
      {children}
    </Guard>
  )
}

/**
 * Guard que requiere cualquier usuario autenticado
 */
export function AuthenticatedGuard({ children, fallback }: Omit<GuardBaseProps, 'loading' | 'action' | 'roles'>) {
  const result = usePermission('view:account')
  
  return result.hasPermission ? <>{children}</> : (fallback ?? null)
}

// Export por defecto
export default Guard