// src/components/ProtectedRoute.tsx
/**
 * ProtectedRoute - Guard a nivel de ruta
 * Redirige si el usuario no tiene acceso según roles o autenticación
 */

'use client'

import { ReactNode, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useRoles } from '@/features/auth/hooks/usePermission'
import type { Role } from '@/config/permissions'
import { Loader2, Lock, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// ============================================================================
// Props
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode
  /**
   * Roles permitidos para acceder a la ruta
   * Si no se proporciona, cualquier usuario autenticado puede acceder
   */
  roles?: Role[]
  /**
   * Ruta a la que redirigir si no tiene acceso
   * @default '/'
   */
  redirectTo?: string
  /**
   * Mensaje de acceso denegado personalizado
   */
  deniedMessage?: string
}

// ============================================================================
// Componente
// ============================================================================

/**
 * ProtectedRoute - Protege rutas según autenticación y roles
 * 
 * @example
 * // Cualquier usuario autenticado
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Solo clientes
 * <ProtectedRoute roles={['CLIENT']}>
 *   <OrdersPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Vendedores y admins
 * <ProtectedRoute roles={['SELLER', 'ADMIN']}>
 *   <SellerPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  roles,
  redirectTo = '/',
  deniedMessage,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isAuthLoading, user } = useAuth()
  
  // Verificar roles si se proporcionan
  const { hasPermission: hasRoleAccess, isLoading: isRoleLoading } = useRoles(roles ?? [])
  
  const isLoading = isAuthLoading || isRoleLoading

  // Determinar si tiene acceso
  const hasAccess = useMemo(() => {
    // Si no está autenticado, no tiene acceso
    if (!isAuthenticated) return false
    
    // Si no hay roles específicos requeridos, cualquier autenticado tiene acceso
    if (!roles || roles.length === 0) return true
    
    // Verificar rol
    return hasRoleAccess
  }, [isAuthenticated, roles, hasRoleAccess])

  // Still checking session — show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Header />
        <main className="flex flex-col items-center justify-center pt-32 pb-20 gap-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Verificando sesión…</p>
        </main>
        <Footer />
      </div>
    )
  }

  // Not authenticated — show blocked message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/40">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-6 text-center px-6 min-h-[calc(100vh-0px)]">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Acceso restringido
            </h1>
            <p className="text-muted-foreground max-w-md">
              Necesitás iniciar sesión para acceder a esta página.
            </p>
          </div>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Link href="/login">
              <LogIn className="size-4" />
              Iniciar sesión
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  // Autenticado pero sin el rol requerido — acceso denegado
  if (!hasAccess) {
    const message = deniedMessage ?? getDefaultDeniedMessage(user?.role, roles)
    
    return (
      <div className="min-h-screen flex flex-col bg-muted/40">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-6 text-center px-6 min-h-[calc(100vh-0px)]">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Acceso denegado
            </h1>
            <p className="text-muted-foreground max-w-md">
              {message}
            </p>
          </div>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Link href={redirectTo}>
              Volver al inicio
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  // Authenticated and has correct role — render children
  return <>{children}</>
}

// ============================================================================
// Helpers
// ============================================================================

function getDefaultDeniedMessage(userRole: string | undefined, requiredRoles?: Role[]): string {
  if (!userRole) {
    return 'No tenés permiso para acceder a esta página.'
  }
  
  if (requiredRoles && requiredRoles.length > 0) {
    const roleNames = requiredRoles.map(r => {
      switch (r) {
        case 'CLIENT': return 'cliente'
        case 'SELLER': return 'vendedor'
        case 'ADMIN': return 'administrador'
        default: return r
      }
    }).join(' o ')
    
    return `Esta página es solo para ${roleNames}. Tu rol actual no te permite acceder.`
  }
  
  return 'No tenés permiso para acceder a esta página.'
}

// Export por defecto
export default ProtectedRoute