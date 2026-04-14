// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PROTECTED_ROUTES, isRouteProtected } from '@/config/permissions'

/**
 * Rutas públicas que deben ser accesibles sin autenticación
 */
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/catalogo']

/**
 * Middleware de autenticación server-side
 * - Verifica cookies de autenticación
 * - Protege rutas privadas usando permissions.ts
 * - La verificación por roles específica se maneja en ProtectedRoute (client-side)
 * 
 * NOTA: Para protección por rol server-side, el JWT debe contener el campo 'role'
 * y decodificarse aquí. Por ahora, /pedidos (solo CLIENT) se protege en cliente.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener tokens de las cookies
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const hasAuth = !!accessToken || !!refreshToken

  // Verificar si es una ruta protegida (usa permissions.ts)
  const requiresAuth = isRouteProtected(pathname)
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  // Verificar si es ruta de API o static
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticFile = pathname.includes('.') && !pathname.startsWith('/api/')

  // Saltar middleware para rutas no relevantes
  if (isApiRoute || isStaticFile || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // 1. Rutas protegidas requieren autenticación
  if (requiresAuth && !hasAuth) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Verificación por rol específica para /pedidos (solo CLIENT)
  // Esto requiere decodificar el JWT o hacer un request al backend
  // Por ahora, se maneja en ProtectedRoute del cliente
  
  // 3. Si está autenticado y trata de acceder a login/register, redirigir
  if (hasAuth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

/**
 * Configurar en qué rutas aplica el middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}