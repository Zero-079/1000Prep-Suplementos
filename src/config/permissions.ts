// src/config/permissions.ts
/**
 * Sistema de permisos basado en roles (RBAC)
 * Fuente única de verdad para roles y permisos
 */

// ============================================================================
// Tipos
// ============================================================================

/**
 * Roles disponibles en el sistema
 */
export type Role = 'CLIENT' | 'SELLER' | 'ADMIN'

/**
 * Acciones posibles en el sistema
 * Formato: [operación]:[recurso]
 */
export type Action =
  | 'view:account'       // acceder a /cuenta
  | 'view:orders'        // acceder a /pedidos
  | 'create:order'       // crear pedidos
  | 'edit:supplement'    // editar suplementos
  | 'create:supplement' // crear suplementos
  | 'delete:supplement'  // eliminar suplementos
  | 'manage:users'       // gestionar usuarios (futuro ADMIN)

/**
 * Mapeo de roles a sus permisos
 */
export type RolePermissions = Record<Role, Action[]>

// ============================================================================
// Configuración de permisos por rol
// ============================================================================

/**
 * Definición de permisos por cada rol
 * IMPORTANTE: Mantener orden jerárquico (más permisos al final)
 */
const ROLE_PERMISSIONS_CONFIG: RolePermissions = {
  CLIENT: [
    'view:account',
    'view:orders',
    'create:order',
  ],
  SELLER: [
    'view:account',
    'edit:supplement',
    'create:supplement',
    'delete:supplement',
  ],
  ADMIN: [
    'view:account',
    'view:orders',
    'create:order',
    'edit:supplement',
    'create:supplement',
    'delete:supplement',
    'manage:users',
  ],
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Obtiene todos los permisos para un rol específico
 */
export function getPermissionsForRole(role: Role): Action[] {
  return ROLE_PERMISSIONS_CONFIG[role] ?? []
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: Role, action: Action): boolean {
  const permissions = ROLE_PERMISSIONS_CONFIG[role]
  return permissions?.includes(action) ?? false
}

/**
 * Verifica si el usuario tiene alguno de los roles permitidos
 */
export function hasRole(userRole: Role | undefined, allowedRoles: Role[]): boolean {
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

/**
 * Obtiene todos los roles disponibles
 */
export function getAllRoles(): Role[] {
  return Object.keys(ROLE_PERMISSIONS_CONFIG) as Role[]
}

/**
 * Obtiene todas las acciones disponibles
 */
export function getAllActions(): Action[] {
  const actions = new Set<Action>()
  Object.values(ROLE_PERMISSIONS_CONFIG).forEach((perms) => {
    perms.forEach((action) => actions.add(action))
  })
  return Array.from(actions)
}

// ============================================================================
// Rutas y requisitos
// ============================================================================

/**
 * Rutas protegidas por rol
 * Se usa en middleware y ProtectedRoute
 */
export const PROTECTED_ROUTES: Record<string, Role[]> = {
  '/cuenta': ['CLIENT', 'SELLER', 'ADMIN'],
  '/pedidos': ['CLIENT'],
  '/admin': ['ADMIN'], // futuro
}

/**
 * Verifica si una ruta requiere rol específico
 * @returns true si la ruta tiene restricción de roles
 */
export function isRouteProtected(pathname: string): boolean {
  return Object.keys(PROTECTED_ROUTES).some((route) => pathname.startsWith(route))
}

/**
 * Obtiene los roles permitidos para una ruta
 */
export function getRolesForRoute(pathname: string): Role[] | undefined {
  const route = Object.keys(PROTECTED_ROUTES).find((r) => pathname.startsWith(r))
  return route ? PROTECTED_ROUTES[route] : undefined
}

/**
 * Verifica si el usuario puede acceder a una ruta
 */
export function canAccessRoute(
  userRole: Role | undefined,
  pathname: string
): boolean {
  const allowedRoles = getRolesForRoute(pathname)
  
  // Si no hay restricción de roles, cualquier usuario autenticado puede acceder
  if (!allowedRoles) return true
  
  // Verificar si el rol del usuario está en la lista de permitidos
  return userRole ? allowedRoles.includes(userRole) : false
}

// ============================================================================
// Extensible para nuevos roles futuros
// ============================================================================

/**
 * Agregar nuevo rol:
 * 1. Agregar el rol al tipo Role
 * 2. Agregar los permisos en ROLE_PERMISSIONS_CONFIG
 * 3. Actualizar PROTECTED_ROUTES si es necesario
 * 
 * @example
 * // Agregar rol MANAGER
 * export type Role = 'CLIENT' | 'SELLER' | 'ADMIN' | 'MANAGER'
 * 
 * ROLE_PERMISSIONS_CONFIG = {
 *   ...ROLE_PERMISSIONS_CONFIG,
 *   MANAGER: ['view:account', 'view:orders', 'edit:supplement'],
 * }
 */

// Export por defecto para conveniencia
export default {
  getPermissionsForRole,
  hasPermission,
  hasRole,
  getAllRoles,
  getAllActions,
  PROTECTED_ROUTES,
  isRouteProtected,
  getRolesForRoute,
  canAccessRoute,
}